#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Agentic OS — Installer
# =============================================================================
# Main installer for new users. Run after `git clone`:
#   bash scripts/install.sh
#
# What it does:
#   1. Checks prerequisites (git, bash, python3)
#   2. Creates .env from .env.example if missing
#   3. Runs scripts/setup.sh for system dependencies
#   4. Presents a skill selection menu
#   5. Auto-resolves skill dependencies
#   6. Removes unselected optional skills
#   7. Writes installed.json with the user's choices
#   8. Prints next steps
#
# Idempotent — safe to run multiple times.
# =============================================================================

# ---------- Resolve repo root from script location ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# ---------- Colors ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ---------- Helpers ----------
info()    { printf "${CYAN}%s${NC}\n" "$1"; }
success() { printf "${GREEN}  ✓ %s${NC}\n" "$1"; }
warn()    { printf "${YELLOW}  ! %s${NC}\n" "$1"; }
fail()    { printf "${RED}  ✗ %s${NC}\n" "$1"; }

# ---------- Paths ----------
CATALOG="$REPO_ROOT/.claude/skills/_catalog/catalog.json"
INSTALLED_JSON="$REPO_ROOT/.claude/skills/_catalog/installed.json"
SKILLS_DIR="$REPO_ROOT/.claude/skills"

# =============================================================================
# 1. Welcome banner
# =============================================================================
clear 2>/dev/null || true
echo ""
printf "${CYAN}${BOLD}"
cat << 'BANNER'
    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║            A G E N T I C   O S               ║
    ║                                              ║
    ║      Your AI-powered business assistant      ║
    ║                                              ║
    ╚══════════════════════════════════════════════╝
BANNER
printf "${NC}"
echo ""
printf "${DIM}  Installer v1.0${NC}\n"
echo ""

# =============================================================================
# 2. Check prerequisites
# =============================================================================
info "Checking prerequisites..."
echo ""

PREREQ_FAIL=0

# Git
printf "  git .......... "
if command -v git &>/dev/null; then
    printf "${GREEN}$(git --version | awk '{print $3}')${NC}\n"
else
    printf "${RED}not found${NC}\n"
    fail "Install git: https://git-scm.com/downloads"
    PREREQ_FAIL=1
fi

# Bash (version 3+ is fine for this script)
printf "  bash ......... "
if command -v bash &>/dev/null; then
    printf "${GREEN}${BASH_VERSION}${NC}\n"
else
    printf "${RED}not found${NC}\n"
    fail "bash is required"
    PREREQ_FAIL=1
fi

# Python 3
printf "  python3 ...... "
if command -v python3 &>/dev/null; then
    printf "${GREEN}$(python3 --version 2>&1 | awk '{print $2}')${NC}\n"
else
    printf "${RED}not found${NC}\n"
    fail "Install Python 3: https://www.python.org/downloads/"
    PREREQ_FAIL=1
fi

echo ""

if [[ $PREREQ_FAIL -ne 0 ]]; then
    fail "Missing prerequisites — install them and re-run this script."
    exit 1
fi

success "All prerequisites met"
echo ""

# =============================================================================
# 3. Create .env from .env.example if missing
# =============================================================================
info "Checking environment..."
echo ""

if [[ -f "$REPO_ROOT/.env" ]]; then
    success ".env already exists"
else
    if [[ -f "$REPO_ROOT/.env.example" ]]; then
        cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
        success "Created .env from .env.example"
        warn "Add your API keys to .env later — skills work without them"
    else
        warn "No .env.example found — skipping .env creation"
    fi
fi
echo ""

# =============================================================================
# 4. Run system dependency setup
# =============================================================================
info "Installing system dependencies..."
echo ""

if [[ -f "$REPO_ROOT/scripts/setup.sh" ]]; then
    bash "$REPO_ROOT/scripts/setup.sh"
else
    warn "scripts/setup.sh not found — skipping dependency install"
fi
echo ""

# =============================================================================
# 5. Verify catalog exists
# =============================================================================
if [[ ! -f "$CATALOG" ]]; then
    fail "Catalog not found at $CATALOG"
    fail "Your clone may be incomplete. Try: git checkout -- .claude/skills/_catalog/"
    exit 1
fi

# =============================================================================
# 6. Parse catalog and build skill menu
# =============================================================================
# We use python3 to parse JSON since jq may not be installed.
# The python script outputs structured data the bash script consumes.

# Extract core skills list
CORE_SKILLS=$(python3 -c "
import json, sys
with open('$CATALOG') as f:
    cat = json.load(f)
for s in cat['core_skills']:
    print(s)
")

# Extract optional skills grouped by category, with metadata
# Output format: name|category|description|services|dependencies
OPTIONAL_SKILLS=$(python3 -c "
import json
with open('$CATALOG') as f:
    cat = json.load(f)
core = set(cat['core_skills'])
# Category display order
order = {'utility': 1, 'strategy': 2, 'execution': 3, 'visual': 4, 'operations': 5}
skills = []
for name, info in cat['skills'].items():
    if name not in core:
        skills.append((
            order.get(info['category'], 99),
            info['category'],
            name,
            info['description'],
            ','.join(info.get('requires_services', [])),
            ','.join(info.get('dependencies', []))
        ))
skills.sort(key=lambda x: (x[0], x[2]))
for s in skills:
    print(f'{s[2]}|{s[1]}|{s[3]}|{s[4]}|{s[5]}')
")

# =============================================================================
# 7. Display the skill selection menu
# =============================================================================
echo ""
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
printf "${CYAN}${BOLD}  Skill Selection${NC}\n"
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
echo ""

# Show core skills
printf "${BOLD}  CORE (always installed):${NC}\n"
while IFS= read -r skill; do
    # Look up description from catalog
    desc=$(python3 -c "
import json
with open('$CATALOG') as f:
    cat = json.load(f)
# Core skills might not be in 'skills' dict — use a hardcoded fallback
descs = {
    'meta-skill-creator': 'Build and iterate on new skills',
    'meta-wrap-up': 'End-of-session wrap-up',
    'mkt-brand-voice': 'Extract or build your brand voice',
    'mkt-positioning': 'Develop positioning angles',
    'mkt-icp': 'Define ideal customer profiles',
}
if '$skill' in cat.get('skills', {}):
    print(cat['skills']['$skill']['description'])
else:
    print(descs.get('$skill', ''))
")
    printf "    ${GREEN}✓${NC} %-26s ${DIM}— %s${NC}\n" "$skill" "$desc"
done <<< "$CORE_SKILLS"
echo ""

# Build arrays for optional skills
declare -a SKILL_NAMES=()
declare -a SKILL_CATEGORIES=()
declare -a SKILL_DESCRIPTIONS=()
declare -a SKILL_SERVICES=()
declare -a SKILL_DEPS=()

while IFS='|' read -r name category description services deps; do
    [[ -z "$name" ]] && continue
    SKILL_NAMES+=("$name")
    SKILL_CATEGORIES+=("$category")
    SKILL_DESCRIPTIONS+=("$description")
    SKILL_SERVICES+=("$services")
    SKILL_DEPS+=("$deps")
done <<< "$OPTIONAL_SKILLS"

# Display grouped by category
printf "${BOLD}  OPTIONAL — enter numbers to toggle, or \"all\" to select everything:${NC}\n"
echo ""

CURRENT_CATEGORY=""
NUM=0
for i in "${!SKILL_NAMES[@]}"; do
    NUM=$((i + 1))
    cat="${SKILL_CATEGORIES[$i]}"

    # Print category header when it changes
    if [[ "$cat" != "$CURRENT_CATEGORY" ]]; then
        # Capitalize first letter of category
        cat_display="$(echo "$cat" | python3 -c "import sys; print(sys.stdin.read().strip().title())")"
        printf "    ${BOLD}%s:${NC}\n" "$cat_display"
        CURRENT_CATEGORY="$cat"
    fi

    # Build the service note (e.g., "needs FIRECRAWL_API_KEY")
    svc_note=""
    if [[ -n "${SKILL_SERVICES[$i]}" ]]; then
        svc_note=" ${DIM}(needs ${SKILL_SERVICES[$i]})${NC}"
    fi

    # Build the dependency note (e.g., "auto-adds: tool-humanizer")
    dep_note=""
    if [[ -n "${SKILL_DEPS[$i]}" ]]; then
        dep_note=" ${DIM}(auto-adds: ${SKILL_DEPS[$i]})${NC}"
    fi

    printf "     ${BOLD}[%2d]${NC} %-26s ${DIM}— %s${NC}%b%b\n" \
        "$NUM" "${SKILL_NAMES[$i]}" "${SKILL_DESCRIPTIONS[$i]}" "$svc_note" "$dep_note"
done
echo ""

# =============================================================================
# 8. Collect user selection
# =============================================================================
printf "  Enter numbers separated by spaces (e.g., \"1 5 6\"), \"all\", or press Enter for core only: "
read -r USER_INPUT

# Parse selection into an array of indices (0-based)
declare -a SELECTED_INDICES=()

if [[ "${USER_INPUT,,}" == "all" ]]; then
    # Select everything
    for i in "${!SKILL_NAMES[@]}"; do
        SELECTED_INDICES+=("$i")
    done
elif [[ -n "$USER_INPUT" ]]; then
    # Parse space-separated numbers
    for num in $USER_INPUT; do
        # Validate it is a number in range
        if [[ "$num" =~ ^[0-9]+$ ]] && [[ "$num" -ge 1 ]] && [[ "$num" -le "${#SKILL_NAMES[@]}" ]]; then
            SELECTED_INDICES+=("$((num - 1))")
        else
            warn "Ignoring invalid selection: $num"
        fi
    done
fi

# =============================================================================
# 9. Resolve dependencies
# =============================================================================
# Build the set of selected skill names
declare -A SELECTED_MAP=()
for idx in "${SELECTED_INDICES[@]}"; do
    SELECTED_MAP["${SKILL_NAMES[$idx]}"]=1
done

# Resolve: if a selected skill has dependencies, add them
DEPS_ADDED=()
for idx in "${SELECTED_INDICES[@]}"; do
    if [[ -n "${SKILL_DEPS[$idx]}" ]]; then
        IFS=',' read -ra dep_list <<< "${SKILL_DEPS[$idx]}"
        for dep in "${dep_list[@]}"; do
            dep=$(echo "$dep" | xargs)  # trim whitespace
            [[ -z "$dep" ]] && continue
            if [[ -z "${SELECTED_MAP[$dep]:-}" ]]; then
                SELECTED_MAP["$dep"]=1
                DEPS_ADDED+=("$dep (required by ${SKILL_NAMES[$idx]})")
            fi
        done
    fi
done

echo ""

# Report auto-added dependencies
if [[ ${#DEPS_ADDED[@]} -gt 0 ]]; then
    info "Auto-resolved dependencies:"
    for note in "${DEPS_ADDED[@]}"; do
        printf "    ${GREEN}+${NC} %s\n" "$note"
    done
    echo ""
fi

# =============================================================================
# 10. Build final skill lists
# =============================================================================
# Installed = core + selected optional
declare -a INSTALLED_SKILLS=()
while IFS= read -r skill; do
    INSTALLED_SKILLS+=("$skill")
done <<< "$CORE_SKILLS"

for name in "${!SELECTED_MAP[@]}"; do
    INSTALLED_SKILLS+=("$name")
done

# Removed = optional skills NOT selected
declare -a REMOVED_SKILLS=()
for i in "${!SKILL_NAMES[@]}"; do
    if [[ -z "${SELECTED_MAP[${SKILL_NAMES[$i]}]:-}" ]]; then
        REMOVED_SKILLS+=("${SKILL_NAMES[$i]}")
    fi
done

# =============================================================================
# 11. Remove unselected skill folders
# =============================================================================
if [[ ${#REMOVED_SKILLS[@]} -gt 0 ]]; then
    info "Removing unselected skills..."
    for skill in "${REMOVED_SKILLS[@]}"; do
        skill_path="$SKILLS_DIR/$skill"
        if [[ -d "$skill_path" ]]; then
            rm -rf "$skill_path"
            printf "    ${DIM}removed %s${NC}\n" "$skill"
        fi
    done
    echo ""
fi

# =============================================================================
# 12. Write installed.json
# =============================================================================
# Ensure the _catalog directory exists
mkdir -p "$SKILLS_DIR/_catalog"

# Write skill lists to temp files for python to read cleanly
TMPDIR_INSTALL=$(mktemp -d)
printf '%s\n' "${INSTALLED_SKILLS[@]}" > "$TMPDIR_INSTALL/installed.txt"
printf '%s\n' "${REMOVED_SKILLS[@]}" > "$TMPDIR_INSTALL/removed.txt" 2>/dev/null || touch "$TMPDIR_INSTALL/removed.txt"

python3 -c "
import json, datetime, sys

with open('$TMPDIR_INSTALL/installed.txt') as f:
    installed = sorted([l.strip() for l in f if l.strip()])
with open('$TMPDIR_INSTALL/removed.txt') as f:
    removed = sorted([l.strip() for l in f if l.strip()])

with open('$CATALOG') as f:
    version = json.load(f)['version']

data = {
    'installed_at': datetime.date.today().isoformat(),
    'version': version,
    'installed_skills': installed,
    'removed_skills': removed
}

with open('$INSTALLED_JSON', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
"
rm -rf "$TMPDIR_INSTALL"

success "Wrote skill manifest to .claude/skills/_catalog/installed.json"
echo ""

# =============================================================================
# 13. Summary
# =============================================================================
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
printf "${CYAN}${BOLD}  Installation Complete${NC}\n"
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
echo ""

printf "  ${BOLD}Installed skills (%d):${NC}\n" "${#INSTALLED_SKILLS[@]}"
for skill in $(printf '%s\n' "${INSTALLED_SKILLS[@]}" | sort); do
    printf "    ${GREEN}✓${NC} %s\n" "$skill"
done
echo ""

if [[ ${#REMOVED_SKILLS[@]} -gt 0 ]]; then
    printf "  ${BOLD}Removed (%d):${NC}\n" "${#REMOVED_SKILLS[@]}"
    for skill in $(printf '%s\n' "${REMOVED_SKILLS[@]}" | sort); do
        printf "    ${DIM}✗ %s${NC}\n" "$skill"
    done
    echo ""
fi

# Check if any installed skills need API keys
MISSING_KEYS=()
for i in "${!SKILL_NAMES[@]}"; do
    if [[ -n "${SELECTED_MAP[${SKILL_NAMES[$i]}]:-}" ]] && [[ -n "${SKILL_SERVICES[$i]}" ]]; then
        IFS=',' read -ra keys <<< "${SKILL_SERVICES[$i]}"
        for key in "${keys[@]}"; do
            key=$(echo "$key" | xargs)
            [[ -z "$key" ]] && continue
            MISSING_KEYS+=("$key")
        done
    fi
done

if [[ ${#MISSING_KEYS[@]} -gt 0 ]]; then
    printf "  ${YELLOW}${BOLD}API keys to add (optional — skills work without them):${NC}\n"
    # Deduplicate
    printf '%s\n' "${MISSING_KEYS[@]}" | sort -u | while read -r key; do
        printf "    ${YELLOW}→${NC} %s  ${DIM}(add to .env)${NC}\n" "$key"
    done
    echo ""
fi

printf "${BOLD}  Next steps:${NC}\n"
echo "    1. Add API keys to .env (if any skills need them)"
echo "    2. Run ${BOLD}claude${NC} and say ${BOLD}'start here'${NC}"
echo ""
printf "  ${DIM}Re-run this installer anytime to change your skill selection.${NC}\n"
echo ""
