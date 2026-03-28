const MAX_DISPLAY = 5;

const COLOR_MAP: Record<string, string> = {
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
  "Custom -- Pick Your Own": "conic-gradient(#f97171, #eab308, #34d399, #0ea5e9, #a78bfa, #f97171)",
};

function getColor(name: string): string {
  return COLOR_MAP[name] || "#d4d4d8";
}

export function ColorSwatches({ colors }: { colors: string[] }) {
  if (colors.length === 0) return null;

  const visible = colors.slice(0, MAX_DISPLAY);
  const remaining = colors.length - MAX_DISPLAY;

  return (
    <div className="flex items-center gap-1.5">
      {visible.map((name) => {
        const color = getColor(name);
        const isGradient = color.startsWith("conic");
        return (
          <span
            key={name}
            className="inline-block h-3.5 w-3.5 rounded-full border border-border/50"
            style={isGradient ? { background: color } : { backgroundColor: color }}
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
