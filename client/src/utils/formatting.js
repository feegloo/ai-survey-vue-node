export function formatArrayField(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return parsed.length ? parsed.join(", ") : "—";
  } catch {
    return value || "—";
  }
}
