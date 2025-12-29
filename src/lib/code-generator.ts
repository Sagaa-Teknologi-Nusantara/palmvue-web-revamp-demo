export function generateEntityCode(
  prefix: string,
  existingCodes: string[],
): string {
  const prefixPattern = new RegExp(`^${prefix}-(\\d+)$`);
  const numbers = existingCodes
    .map((code) => {
      const match = code.match(prefixPattern);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null);

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}
