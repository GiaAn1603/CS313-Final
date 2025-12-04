export function extractStormName(fullName: string): string {
  const noBracket = fullName.split("(")[0].trim();
  const parts = noBracket.split(" ");
  return parts[parts.length - 1];
}
