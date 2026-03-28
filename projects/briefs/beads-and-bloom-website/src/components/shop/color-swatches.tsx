"use client";

const MAX_DISPLAY = 5;

export const COLOR_MAP: Record<string, string> = {
  "Ocean Blue": "#0ea5e9",
  "Sea Foam": "#6ee7b7",
  "Pearl White": "#faf5ef",
  "Sky Blue": "#7dd3fc",
  "Coral": "#f97171",
  "Peach": "#fdba74",
  "Gold": "#eab308",
  "Warm Sand": "#d4a574",
  "Champagne": "#f5e6d3",
  "Ocean Mix": "#0ea5e9",
  "Sunset Mix": "#f97171",
  "Tropical Mix": "#34d399",
  "Custom -- Pick Your Own":
    "conic-gradient(#f97171, #eab308, #34d399, #0ea5e9, #a78bfa, #f97171)",
};

export function getColor(name: string): string {
  return COLOR_MAP[name] || "#d4d4d8";
}

type ColorSwatchesProps = {
  colors: string[];
  interactive?: boolean;
  selected?: string[];
  onSelect?: (colors: string[]) => void;
};

export function ColorSwatches({
  colors,
  interactive = false,
  selected = [],
  onSelect,
}: ColorSwatchesProps) {
  if (colors.length === 0) return null;

  const visible = interactive ? colors : colors.slice(0, MAX_DISPLAY);
  const remaining = interactive ? 0 : colors.length - MAX_DISPLAY;

  function toggleColor(name: string) {
    if (!onSelect) return;
    if (selected.includes(name)) {
      onSelect(selected.filter((c) => c !== name));
    } else {
      onSelect([...selected, name]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((name) => {
        const color = getColor(name);
        const isGradient = color.startsWith("conic");
        const isSelected = selected.includes(name);

        if (interactive) {
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleColor(name)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                  : "border-border/50 hover:border-border"
              }`}
              title={name}
              aria-pressed={isSelected}
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border border-border/50 shrink-0"
                style={
                  isGradient
                    ? { background: color }
                    : { backgroundColor: color }
                }
              />
              <span className="text-foreground">{name}</span>
            </button>
          );
        }

        return (
          <span
            key={name}
            className="inline-block h-3.5 w-3.5 rounded-full border border-border/50"
            style={
              isGradient
                ? { background: color }
                : { backgroundColor: color }
            }
            title={name}
            aria-label={name}
          />
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}
