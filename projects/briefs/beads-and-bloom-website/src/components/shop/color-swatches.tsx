const MAX_DISPLAY = 5;

export function ColorSwatches({ colors }: { colors: string[] }) {
  if (colors.length === 0) return null;

  const visible = colors.slice(0, MAX_DISPLAY);
  const remaining = colors.length - MAX_DISPLAY;

  return (
    <div className="flex items-center gap-1">
      {visible.map((hex) => (
        <span
          key={hex}
          className="inline-block h-3 w-3 rounded-full border border-border"
          style={{ backgroundColor: hex }}
          aria-label={`Color ${hex}`}
        />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}
