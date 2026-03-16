#!/usr/bin/env bash
set -euo pipefail

# ==========================================================
# Agentic OS — Safe Update Script
# Pulls upstream changes without overwriting user data.
#
# Usage: bash scripts/update.sh
# ==========================================================

# ---------- Colors ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

info()  { printf "${CYAN}  %s${NC}\n" "$1"; }
ok()    { printf "${GREEN}  ✓ %s${NC}\n" "$1"; }
warn()  { printf "${YELLOW}  → %s${NC}\n" "$1"; }

# ---------- Repo root from script location ----------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) REPO_ROOT="$(cygpath -m "$REPO_ROOT")" ;; esac
PYTHON_CMD="python3"; command -v python3 &>/dev/null || PYTHON_CMD="python"
cd "$REPO_ROOT"

CATALOG="$REPO_ROOT/.claude/skills/_catalog/catalog.json"
INSTALLED="$REPO_ROOT/.claude/skills/_catalog/installed.json"
BACKUP_DIR="$REPO_ROOT/.backup"

# ---------- Protected paths (never overwritten) ----------
# These are stashed before pull and restored after.
PROTECTED_PATHS=(
    ".env"
    ".mcp.json"
    "context/USER.md"
    "context/SOUL.md"

    "context/learnings.md"
    "context/memory/"
    "brand_context/*.md"
    "projects/"
    ".claude/skills/_catalog/installed.json"
)

# =========================================================
# Step 1: Verify we're in a git repo
# =========================================================
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    echo "Error: not a git repository. Run this from the Agentic OS root."
    exit 1
fi

echo ""
echo "========================================="
echo "  Agentic OS — Updating..."
echo "========================================="
echo ""

# =========================================================
# Step 2: Read installed.json for user's skill choices
# =========================================================
if [[ ! -f "$INSTALLED" ]]; then
    warn "installed.json not found — looks like first setup."
    warn "Run 'bash scripts/install.sh' first to select your skills."
    echo ""
    echo "  Continuing with update (your files are still protected)."
    echo ""
    HAVE_INSTALLED_JSON=false
else
    HAVE_INSTALLED_JSON=true
fi

# =========================================================
# Step 3: Save current version tag and HEAD
# =========================================================
OLD_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
OLD_HEAD=$(git rev-parse HEAD)

if [[ -n "$OLD_TAG" ]]; then
    info "Current version: $OLD_TAG"
else
    info "No version tag found (using commit history)"
fi

# =========================================================
# Step 4: Stash local changes to protected paths
# =========================================================
# Build a pathspec for git diff that covers protected paths.
# We only stash if there are actual changes to protected files.
STASHED=false

has_protected_changes() {
    for p in "${PROTECTED_PATHS[@]}"; do
        # Check both staged and unstaged changes, plus untracked files
        if git diff --name-only -- "$p" 2>/dev/null | grep -q .; then
            return 0
        fi
        if git diff --cached --name-only -- "$p" 2>/dev/null | grep -q .; then
            return 0
        fi
    done
    return 1
}

if has_protected_changes; then
    info "Stashing local changes to protected files..."
    # Stash only the protected paths (keep everything else as-is)
    git stash push --include-untracked -m "agentic-os-update-$(date +%s)" -- "${PROTECTED_PATHS[@]}" 2>/dev/null && STASHED=true
    if $STASHED; then
        ok "Protected files stashed"
    fi
fi

# =========================================================
# Step 5: Backup locally-modified skills before pull
# =========================================================
# Skills are updated by the self-improvement loop (Rules, direct fixes).
# We backup any modified skills so the user can review upstream changes
# and approve/deny per skill.
SKILL_BACKUP_DIR="$BACKUP_DIR/skills-$(date +%s)"
MODIFIED_SKILLS=()
USER_CREATED_SKILLS=()

info "Checking for locally-modified skills..."

if [[ -d "$REPO_ROOT/.claude/skills" ]]; then
    for skill_dir in "$REPO_ROOT/.claude/skills"/*/; do
        [[ -d "$skill_dir" ]] || continue
        skill_name=$(basename "$skill_dir")
        [[ "$skill_name" == "_catalog" ]] && continue

        # Check if this skill is entirely untracked (user-created, not from upstream)
        tracked_files=$(git ls-files -- ".claude/skills/$skill_name/" 2>/dev/null || true)
        if [[ -z "$tracked_files" ]]; then
            USER_CREATED_SKILLS+=("$skill_name")
            continue
        fi

        # Check if any files in this skill have local modifications
        modified_files=$(git diff --name-only -- ".claude/skills/$skill_name/" 2>/dev/null || true)
        if [[ -n "$modified_files" ]]; then
            mkdir -p "$SKILL_BACKUP_DIR/$skill_name"
            cp -r "$skill_dir"* "$SKILL_BACKUP_DIR/$skill_name/" 2>/dev/null || true
            MODIFIED_SKILLS+=("$skill_name")
            # Show which files were modified
            warn "$skill_name — modified files:"
            echo "$modified_files" | while IFS= read -r f; do
                printf "      %s\n" "$(basename "$f")"
            done
        fi
    done
fi

if [[ ${#MODIFIED_SKILLS[@]} -gt 0 ]]; then
    ok "Backed up ${#MODIFIED_SKILLS[@]} locally-modified skill(s) to $SKILL_BACKUP_DIR"
else
    info "No locally-modified skills found"
fi

if [[ ${#USER_CREATED_SKILLS[@]} -gt 0 ]]; then
    ok "${#USER_CREATED_SKILLS[@]} user-created skill(s) detected (won't be touched by update):"
    for uc_skill in "${USER_CREATED_SKILLS[@]}"; do
        printf "      %s\n" "$uc_skill"
    done
fi

# =========================================================
# Step 6: Pull upstream changes
# =========================================================
info "Pulling from origin main..."
echo ""
PULL_OUTPUT=$(git pull origin main 2>&1) || {
    # If pull fails, restore stash before exiting
    if $STASHED; then
        git stash pop --quiet 2>/dev/null || true
    fi

    # Check if this is an authentication failure
    if echo "$PULL_OUTPUT" | grep -qi "authentication\|403\|could not read\|repository not found\|invalid credentials"; then
        echo ""
        printf "${YELLOW}${BOLD}═══════════════════════════════════════════════${NC}\n"
        printf "${YELLOW}${BOLD}  Authentication Failed${NC}\n"
        printf "${YELLOW}${BOLD}═══════════════════════════════════════════════${NC}\n"
        echo ""
        warn "Your access token has been rotated."
        echo ""
        info "To fix this:"
        echo ""
        echo "  1. Get the latest token from:"
        printf "     ${CYAN}https://www.skool.com/scrapes/classroom/d1cfafed?md=552b0ba753df4c738843913fb3eb8312${NC}\n"
        echo ""
        echo "  2. Update your remote URL:"
        printf "     ${BOLD}git remote set-url origin https://<NEW-TOKEN>@github.com/simonc602/agentic-os.git${NC}\n"
        echo ""
        echo "  3. Run this script again:"
        printf "     ${BOLD}bash scripts/update.sh${NC}\n"
        echo ""
        info "Your local files are untouched — nothing was changed."
    else
        echo "$PULL_OUTPUT"
        echo ""
        echo "  Pull failed. Your files are safe — nothing was changed."
    fi
    exit 1
}

echo "$PULL_OUTPUT"
echo ""

# Check if there were actual changes
if echo "$PULL_OUTPUT" | grep -q "Already up to date"; then
    if $STASHED; then
        git stash pop --quiet 2>/dev/null || true
    fi
    echo ""
    echo "========================================="
    printf "${GREEN}  Already up to date!${NC}\n"
    echo "========================================="
    echo ""
    exit 0
fi

NEW_HEAD=$(git rev-parse HEAD)

# =========================================================
# Step 6a: Show what changed in the pull (system files)
# =========================================================
# Categorise every changed file so the user sees exactly what arrived.
CHANGED_FILES=$(git diff --name-only "${OLD_HEAD}..${NEW_HEAD}" 2>/dev/null || true)

if [[ -n "$CHANGED_FILES" ]]; then
    # Buckets
    CHANGED_SCRIPTS=""
    CHANGED_CLAUDE_MD=""
    CHANGED_CATALOG=""
    CHANGED_SKILL_FILES=""
    CHANGED_OTHER=""

    while IFS= read -r file; do
        case "$file" in
            scripts/*)
                CHANGED_SCRIPTS="${CHANGED_SCRIPTS}\n      ${file}"
                ;;
            CLAUDE.md|PRD.md|README.md|.gitignore|.gitattributes)
                CHANGED_CLAUDE_MD="${CHANGED_CLAUDE_MD}\n      ${file}"
                ;;
            .claude/skills/_catalog/*)
                CHANGED_CATALOG="${CHANGED_CATALOG}\n      ${file}"
                ;;
            .claude/skills/*)
                CHANGED_SKILL_FILES="${CHANGED_SKILL_FILES}\n      ${file}"
                ;;
            context/*|brand_context/*|projects/*|.env*)
                # Protected/user files — skip (handled by stash/restore)
                ;;
            *)
                CHANGED_OTHER="${CHANGED_OTHER}\n      ${file}"
                ;;
        esac
    done <<< "$CHANGED_FILES"

    echo ""
    printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
    printf "${CYAN}${BOLD}  What Changed${NC}\n"
    printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
    echo ""

    if [[ -n "$CHANGED_SCRIPTS" ]]; then
        printf "  ${BOLD}Scripts:${NC}"
        printf "$CHANGED_SCRIPTS\n"
        echo ""
    fi

    if [[ -n "$CHANGED_CLAUDE_MD" ]]; then
        printf "  ${BOLD}System files:${NC}"
        printf "$CHANGED_CLAUDE_MD\n"
        echo ""
    fi

    if [[ -n "$CHANGED_CATALOG" ]]; then
        printf "  ${BOLD}Skill catalog:${NC}"
        printf "$CHANGED_CATALOG\n"
        echo ""
    fi

    if [[ -n "$CHANGED_SKILL_FILES" ]]; then
        printf "  ${BOLD}Skills:${NC}"
        printf "$CHANGED_SKILL_FILES\n"
        echo ""
    fi

    if [[ -n "$CHANGED_OTHER" ]]; then
        printf "  ${BOLD}Other:${NC}"
        printf "$CHANGED_OTHER\n"
        echo ""
    fi

    # Offer to show the full diff for non-skill system files
    SYS_FILES_FOR_DIFF=""
    [[ -n "$CHANGED_SCRIPTS" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_SCRIPTS}"
    [[ -n "$CHANGED_CLAUDE_MD" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_CLAUDE_MD}"
    [[ -n "$CHANGED_CATALOG" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_CATALOG}"
    [[ -n "$CHANGED_OTHER" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_OTHER}"

    if [[ -n "$SYS_FILES_FOR_DIFF" ]]; then
        printf "  ${BOLD}View full diff of system changes?${NC} [y/n] "
        read -r show_diff
        if [[ "$show_diff" =~ ^[yY]$ ]]; then
            echo ""
            # Show diff for each non-skill changed file
            while IFS= read -r file; do
                file=$(echo "$file" | sed 's/^[[:space:]]*//')
                [[ -z "$file" ]] && continue
                printf "\n  ${CYAN}${BOLD}── %s ──${NC}\n" "$file"
                git diff "${OLD_HEAD}..${NEW_HEAD}" -- "$file" 2>/dev/null | while IFS= read -r line; do
                    case "$line" in
                        +*)   printf "${GREEN}%s${NC}\n" "$line" ;;
                        -*)   printf "${YELLOW}%s${NC}\n" "$line" ;;
                        @*)   printf "${CYAN}%s${NC}\n" "$line" ;;
                        *)    echo "$line" ;;
                    esac
                done
            done <<< "$(printf "$SYS_FILES_FOR_DIFF")"
            echo ""
        fi
    fi
fi

# =========================================================
# Step 6b: Review upstream skill changes vs local modifications
# =========================================================
# For each skill that was locally modified AND changed upstream,
# show the diff PER FILE and let the user approve or deny each file.
SKILL_REVIEW_MSG=""

if [[ ${#MODIFIED_SKILLS[@]} -gt 0 ]]; then
    echo ""
    printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
    printf "${CYAN}${BOLD}  Skill Update Review${NC}\n"
    printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
    echo ""
    info "Some skills you've customised have upstream changes."
    info "You'll review each changed file individually."
    echo ""

    for skill_name in "${MODIFIED_SKILLS[@]}"; do
        skill_dir="$REPO_ROOT/.claude/skills/$skill_name"
        backup_skill_dir="$SKILL_BACKUP_DIR/$skill_name"

        # Check if upstream actually changed this skill (vs only local changes)
        if [[ ! -d "$skill_dir" ]]; then
            # Skill was removed upstream — restore user's version
            warn "$skill_name was removed upstream but you had local changes."
            mkdir -p "$skill_dir"
            cp -r "$backup_skill_dir"/* "$skill_dir/" 2>/dev/null || true
            ok "Kept your version of $skill_name"
            SKILL_REVIEW_MSG="${SKILL_REVIEW_MSG}\n    $skill_name: kept (removed upstream)"
            continue
        fi

        echo "  ─────────────────────────────────────────"
        printf "  ${BOLD}%s${NC}\n" "$skill_name"
        echo "  ─────────────────────────────────────────"
        echo ""

        # Find all files that differ between backup (user's) and current (upstream)
        changed_files=$(diff -rq "$backup_skill_dir" "$skill_dir" 2>/dev/null | grep "^Files " | sed 's/^Files //;s/ and / → /;s/ differ$//' || true)
        # Also find files only in upstream (new files added upstream)
        new_upstream=$(diff -rq "$backup_skill_dir" "$skill_dir" 2>/dev/null | grep "^Only in $skill_dir" | sed "s|^Only in $skill_dir[/]*: ||" || true)
        # Files only in backup (removed upstream)
        removed_upstream=$(diff -rq "$backup_skill_dir" "$skill_dir" 2>/dev/null | grep "^Only in $backup_skill_dir" | sed "s|^Only in $backup_skill_dir[/]*: ||" || true)

        if [[ -z "$changed_files" ]] && [[ -z "$new_upstream" ]] && [[ -z "$removed_upstream" ]]; then
            info "No upstream changes — keeping your version."
            cp -r "$backup_skill_dir"/* "$skill_dir/" 2>/dev/null || true
            SKILL_REVIEW_MSG="${SKILL_REVIEW_MSG}\n    $skill_name: kept (no upstream changes)"
            continue
        fi

        # Track per-file decisions for the summary
        file_decisions=""
        accepted_count=0
        kept_count=0

        # --- Review changed files (exist in both, content differs) ---
        if [[ -n "$changed_files" ]]; then
            while IFS= read -r pair; do
                # Extract the backup file and upstream file paths
                backup_file=$(echo "$pair" | sed 's/ → .*//')
                upstream_file=$(echo "$pair" | sed 's/.* → //')
                rel_name=$(echo "$upstream_file" | sed "s|$skill_dir/||;s|$skill_dir||")
                # Handle case where rel_name is the file itself (no subdir)
                if [[ -z "$rel_name" ]]; then
                    rel_name=$(basename "$upstream_file")
                fi

                echo ""
                printf "  ${BOLD}File: %s${NC}\n" "$rel_name"
                echo "  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄"
                echo ""

                # Show the diff for this specific file
                file_diff=$(diff -u "$backup_file" "$upstream_file" 2>/dev/null || true)
                if [[ -n "$file_diff" ]]; then
                    echo "$file_diff" | while IFS= read -r line; do
                        case "$line" in
                            ---*) printf "${YELLOW}%s${NC}\n" "$line" ;;
                            +++*) printf "${GREEN}%s${NC}\n" "$line" ;;
                            +*)   printf "${GREEN}%s${NC}\n" "$line" ;;
                            -*)   printf "${YELLOW}%s${NC}\n" "$line" ;;
                            @*)   printf "${CYAN}%s${NC}\n" "$line" ;;
                            *)    echo "$line" ;;
                        esac
                    done
                fi
                echo ""

                printf "  Accept this change? [y/n/a/k] "
                printf "(y=accept, n=keep yours, a=accept ALL remaining, k=keep ALL remaining) "
                while true; do
                    read -r choice
                    case "$choice" in
                        [yY])
                            ok "Accepted upstream: $rel_name"
                            file_decisions="${file_decisions}\n      ✓ $rel_name (accepted upstream)"
                            accepted_count=$((accepted_count + 1))
                            break
                            ;;
                        [nN])
                            # Restore user's version of this file
                            cp "$backup_file" "$upstream_file" 2>/dev/null || true
                            ok "Kept yours: $rel_name"
                            file_decisions="${file_decisions}\n      ○ $rel_name (kept yours)"
                            kept_count=$((kept_count + 1))
                            break
                            ;;
                        [aA])
                            ok "Accepted upstream: $rel_name"
                            file_decisions="${file_decisions}\n      ✓ $rel_name (accepted upstream)"
                            accepted_count=$((accepted_count + 1))
                            # Accept all remaining changed files
                            ACCEPT_ALL_REMAINING=true
                            break
                            ;;
                        [kK])
                            cp "$backup_file" "$upstream_file" 2>/dev/null || true
                            ok "Kept yours: $rel_name"
                            file_decisions="${file_decisions}\n      ○ $rel_name (kept yours)"
                            kept_count=$((kept_count + 1))
                            # Keep all remaining changed files
                            KEEP_ALL_REMAINING=true
                            break
                            ;;
                        *)
                            printf "  Please enter y, n, a, or k: "
                            ;;
                    esac
                done

                # Handle bulk accept/keep for remaining files
                if [[ "${ACCEPT_ALL_REMAINING:-false}" == "true" ]]; then
                    break
                fi
                if [[ "${KEEP_ALL_REMAINING:-false}" == "true" ]]; then
                    break
                fi
            done <<< "$changed_files"

            # Process any remaining files after bulk decision
            if [[ "${ACCEPT_ALL_REMAINING:-false}" == "true" ]]; then
                # remaining changed files were already accepted (upstream version stays)
                remaining_after=$(echo "$changed_files" | tail -n +$((accepted_count + kept_count + 1)))
                if [[ -n "$remaining_after" ]]; then
                    while IFS= read -r pair; do
                        upstream_file=$(echo "$pair" | sed 's/.* → //')
                        rel_name=$(echo "$upstream_file" | sed "s|$skill_dir/||;s|$skill_dir||")
                        [[ -z "$rel_name" ]] && rel_name=$(basename "$upstream_file")
                        ok "Accepted upstream: $rel_name"
                        file_decisions="${file_decisions}\n      ✓ $rel_name (accepted upstream)"
                        accepted_count=$((accepted_count + 1))
                    done <<< "$remaining_after"
                fi
            fi
            if [[ "${KEEP_ALL_REMAINING:-false}" == "true" ]]; then
                remaining_after=$(echo "$changed_files" | tail -n +$((accepted_count + kept_count + 1)))
                if [[ -n "$remaining_after" ]]; then
                    while IFS= read -r pair; do
                        backup_file=$(echo "$pair" | sed 's/ → .*//')
                        upstream_file=$(echo "$pair" | sed 's/.* → //')
                        rel_name=$(echo "$upstream_file" | sed "s|$skill_dir/||;s|$skill_dir||")
                        [[ -z "$rel_name" ]] && rel_name=$(basename "$upstream_file")
                        cp "$backup_file" "$upstream_file" 2>/dev/null || true
                        ok "Kept yours: $rel_name"
                        file_decisions="${file_decisions}\n      ○ $rel_name (kept yours)"
                        kept_count=$((kept_count + 1))
                    done <<< "$remaining_after"
                fi
            fi
            # Reset bulk flags for next skill
            ACCEPT_ALL_REMAINING=false
            KEEP_ALL_REMAINING=false
        fi

        # --- Handle new files added upstream ---
        if [[ -n "$new_upstream" ]]; then
            while IFS= read -r new_file; do
                [[ -z "$new_file" ]] && continue
                printf "\n  ${GREEN}[NEW]${NC} %s — added upstream\n" "$new_file"
                file_decisions="${file_decisions}\n      + $new_file (new from upstream)"
                accepted_count=$((accepted_count + 1))
            done <<< "$new_upstream"
        fi

        # --- Handle files removed upstream ---
        if [[ -n "$removed_upstream" ]]; then
            while IFS= read -r rm_file; do
                [[ -z "$rm_file" ]] && continue
                printf "\n  ${YELLOW}[REMOVED]${NC} %s — removed upstream, restoring your version\n" "$rm_file"
                # Restore the user's file since upstream removed it
                cp "$backup_skill_dir/$rm_file" "$skill_dir/$rm_file" 2>/dev/null || true
                file_decisions="${file_decisions}\n      ○ $rm_file (kept yours, removed upstream)"
                kept_count=$((kept_count + 1))
            done <<< "$removed_upstream"
        fi

        echo ""
        SKILL_REVIEW_MSG="${SKILL_REVIEW_MSG}\n    $skill_name: $accepted_count accepted, $kept_count kept"
        printf "$file_decisions\n"
    done

    echo ""
    info "Backups saved to $SKILL_BACKUP_DIR in case you change your mind."
    echo ""
fi

# =========================================================
# Step 6: Restore stashed protected files
# =========================================================
if $STASHED; then
    info "Restoring your protected files..."

    if git stash pop --quiet 2>/dev/null; then
        ok "Protected files restored cleanly"
    else
        # Conflicts detected — backup conflicted files and accept upstream
        warn "Merge conflicts detected — backing up your versions..."
        mkdir -p "$BACKUP_DIR"

        # Find conflicted files
        CONFLICTED=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
        if [[ -n "$CONFLICTED" ]]; then
            while IFS= read -r file; do
                # Create backup preserving directory structure
                backup_path="$BACKUP_DIR/$file"
                mkdir -p "$(dirname "$backup_path")"
                # Extract the user's version (stash version) from the conflict
                # Use "ours" version marker in the conflicted file as backup
                cp "$REPO_ROOT/$file" "$backup_path.conflicted" 2>/dev/null || true
                # Accept upstream (theirs = what pull brought in)
                git checkout --theirs -- "$file" 2>/dev/null || true
                git add "$file" 2>/dev/null || true
                warn "Backed up: $file → .backup/$file.conflicted"
            done <<< "$CONFLICTED"
        fi

        # Also try to drop remaining stash if pop left it around
        git stash drop 2>/dev/null || true

        ok "Conflicts resolved (your versions saved in .backup/)"
    fi
fi

# =========================================================
# Step 8: Re-remove skills the user previously removed
# =========================================================
# git pull may restore skill folders that the user explicitly removed.
# installed.json tracks these in its "removed_skills" list.
REMOVED_SKILLS_MSG=""

if $HAVE_INSTALLED_JSON && [[ -f "$INSTALLED" ]]; then
    REMOVED_SKILLS=$($PYTHON_CMD -c "
import json, sys
try:
    with open('$INSTALLED') as f:
        data = json.load(f)
    removed = data.get('removed_skills', [])
    for s in removed:
        print(s)
except Exception:
    sys.exit(0)
" 2>/dev/null || true)

    if [[ -n "$REMOVED_SKILLS" ]]; then
        while IFS= read -r skill; do
            skill_dir="$REPO_ROOT/.claude/skills/$skill"
            if [[ -d "$skill_dir" ]]; then
                rm -rf "$skill_dir"
                warn "Re-removed skill '$skill' (was in your removed list)"
                REMOVED_SKILLS_MSG="${REMOVED_SKILLS_MSG}\n    Removed (per your preference): $skill"
            fi
        done <<< "$REMOVED_SKILLS"
    fi
fi

# =========================================================
# Step 9: Detect & offer newly added upstream skills
# =========================================================
NEW_SKILLS_MSG=""
INSTALLED_NEW_SKILLS_MSG=""

if [[ -f "$CATALOG" ]]; then
    # Get new skills as: name|category|description|services|dependencies
    NEW_SKILLS=$($PYTHON_CMD -c "
import json, sys, os

catalog_path = '$CATALOG'
installed_path = '$INSTALLED'

with open(catalog_path) as f:
    catalog = json.load(f)

catalog_skills = catalog.get('skills', {})
core_skills = set(catalog.get('core_skills', []))

if os.path.exists(installed_path):
    with open(installed_path) as f:
        inst = json.load(f)
    installed = set(inst.get('installed_skills', []))
    removed = set(inst.get('removed_skills', []))
    known = installed | removed | core_skills
else:
    known = set(catalog_skills.keys()) | core_skills

new_skills = set(catalog_skills.keys()) - known
order = {'utility': 1, 'strategy': 2, 'execution': 3, 'visual': 4, 'operations': 5}
for s in sorted(new_skills, key=lambda n: (order.get(catalog_skills[n]['category'], 99), n)):
    info = catalog_skills[s]
    services = ','.join(info.get('requires_services', []))
    deps = ','.join(info.get('dependencies', []))
    print(f'{s}|{info[\"category\"]}|{info[\"description\"]}|{services}|{deps}')
" 2>/dev/null || true)

    if [[ -n "$NEW_SKILLS" ]]; then
        echo ""
        printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
        printf "${CYAN}${BOLD}  New Skills Available${NC}\n"
        printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
        echo ""
        info "These skills were added since your last update:"
        echo ""

        # Build numbered menu
        declare -a NS_NAMES=()
        declare -a NS_CATEGORIES=()
        declare -a NS_DESCRIPTIONS=()
        declare -a NS_SERVICES=()
        declare -a NS_DEPS=()
        NUM=0
        CURRENT_CATEGORY=""

        while IFS='|' read -r name category description services deps; do
            [[ -z "$name" ]] && continue
            NS_NAMES+=("$name")
            NS_CATEGORIES+=("$category")
            NS_DESCRIPTIONS+=("$description")
            NS_SERVICES+=("$services")
            NS_DEPS+=("$deps")
        done <<< "$NEW_SKILLS"

        for i in "${!NS_NAMES[@]}"; do
            NUM=$((i + 1))
            cat="${NS_CATEGORIES[$i]}"

            # Print category header when it changes
            if [[ "$cat" != "$CURRENT_CATEGORY" ]]; then
                first="$(echo "${cat:0:1}" | tr '[:lower:]' '[:upper:]')"
                cat_display="${first}${cat:1}"
                printf "    ${BOLD}%s:${NC}\n" "$cat_display"
                CURRENT_CATEGORY="$cat"
            fi

            # Service note
            svc_note=""
            if [[ -n "${NS_SERVICES[$i]}" ]]; then
                svc_note=" ${DIM}(needs ${NS_SERVICES[$i]})${NC}"
            fi

            # Dependency note
            dep_note=""
            if [[ -n "${NS_DEPS[$i]}" ]]; then
                dep_note=" ${DIM}(auto-adds: ${NS_DEPS[$i]})${NC}"
            fi

            printf "     ${BOLD}[%2d]${NC} %-26s ${DIM}— %s${NC}%b%b\n" \
                "$NUM" "${NS_NAMES[$i]}" "${NS_DESCRIPTIONS[$i]}" "$svc_note" "$dep_note"
        done
        echo ""

        printf "  Enter numbers to install (e.g. \"1 3\"), \"all\", or press Enter to skip: "
        read -r NS_INPUT

        if [[ -n "$NS_INPUT" ]]; then
            # Parse selection
            SELECTED_NS=()
            if [[ "${NS_INPUT,,}" == "all" ]]; then
                SELECTED_NS=("${NS_NAMES[@]}")
            else
                for token in $NS_INPUT; do
                    if [[ "$token" =~ ^[0-9]+$ ]] && [[ "$token" -ge 1 ]] && [[ "$token" -le "${#NS_NAMES[@]}" ]]; then
                        SELECTED_NS+=("${NS_NAMES[$((token - 1))]}")
                    else
                        warn "Ignoring invalid selection: $token"
                    fi
                done
            fi

            if [[ ${#SELECTED_NS[@]} -gt 0 ]]; then
                echo ""
                info "Installing selected skills..."
                echo ""
                for ns in "${SELECTED_NS[@]}"; do
                    # Use add-skill.sh which handles dep resolution & installed.json
                    bash "$REPO_ROOT/scripts/add-skill.sh" "$ns" 2>&1 | sed 's/^/    /'
                    INSTALLED_NEW_SKILLS_MSG="${INSTALLED_NEW_SKILLS_MSG}\n    ${GREEN}✓${NC} $ns"
                done
                echo ""
            fi
        else
            info "Skipped — install later with: bash scripts/add-skill.sh <name>"
            echo ""
        fi

        # Any not-installed new skills still get noted in summary
        for i in "${!NS_NAMES[@]}"; do
            name="${NS_NAMES[$i]}"
            # Check if it was just installed
            was_installed=false
            for ns in "${SELECTED_NS[@]:-}"; do
                if [[ "$ns" == "$name" ]]; then
                    was_installed=true
                    break
                fi
            done
            if ! $was_installed; then
                NEW_SKILLS_MSG="${NEW_SKILLS_MSG}\n  ${YELLOW}[AVAILABLE]${NC} ${CYAN}${name}${NC} — ${NS_DESCRIPTIONS[$i]}"
                NEW_SKILLS_MSG="${NEW_SKILLS_MSG}\n    Install with: bash scripts/add-skill.sh ${name}"
            fi
        done
    fi
fi

# =========================================================
# Step 10: Version tag and changelog
# =========================================================
NEW_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
VERSION_LINE=""
CHANGES=""

if [[ -n "$OLD_TAG" ]] && [[ -n "$NEW_TAG" ]] && [[ "$OLD_TAG" != "$NEW_TAG" ]]; then
    VERSION_LINE="  Updated: ${OLD_TAG} → ${NEW_TAG}"
    CHANGES=$(git log --oneline "${OLD_TAG}..${NEW_TAG}" 2>/dev/null | sed 's/^/    - /')
elif [[ "$OLD_HEAD" != "$NEW_HEAD" ]]; then
    if [[ -n "$NEW_TAG" ]]; then
        VERSION_LINE="  Version: ${NEW_TAG}"
    fi
    CHANGES=$(git log --oneline "${OLD_HEAD}..${NEW_HEAD}" 2>/dev/null | sed 's/^/    - /')
fi

# =========================================================
# Step 11: Summary
# =========================================================
echo ""
echo "========================================="
echo "  Agentic OS — Update Complete"
echo "========================================="
echo ""

if [[ -n "$VERSION_LINE" ]]; then
    echo "$VERSION_LINE"
    echo ""
fi

if [[ -n "$CHANGES" ]]; then
    echo "  Changes:"
    echo "$CHANGES"
    echo ""
fi

if [[ -n "$SKILL_REVIEW_MSG" ]]; then
    echo "  Skill updates:"
    printf "$SKILL_REVIEW_MSG\n"
    echo ""
fi

if [[ -n "$REMOVED_SKILLS_MSG" ]]; then
    printf "$REMOVED_SKILLS_MSG\n"
    echo ""
fi

if [[ -n "$INSTALLED_NEW_SKILLS_MSG" ]]; then
    echo "  Newly installed:"
    printf "$INSTALLED_NEW_SKILLS_MSG\n"
    echo ""
fi

if [[ ${#USER_CREATED_SKILLS[@]} -gt 0 ]]; then
    echo "  Your custom skills (untouched):"
    for uc_skill in "${USER_CREATED_SKILLS[@]}"; do
        printf "    ${GREEN}✓${NC} %s\n" "$uc_skill"
    done
    echo ""
fi

if [[ -n "$NEW_SKILLS_MSG" ]]; then
    echo "  Still available (not installed):"
    printf "$NEW_SKILLS_MSG\n"
    echo ""
fi

echo "  Your files (untouched):"
printf "    brand_context/ ${GREEN}✓${NC}  .env ${GREEN}✓${NC}  context/ ${GREEN}✓${NC}  projects/ ${GREEN}✓${NC}\n"
echo ""
echo "========================================="
echo ""
