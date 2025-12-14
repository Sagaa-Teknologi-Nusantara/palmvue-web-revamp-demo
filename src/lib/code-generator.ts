export function generateEntityCode(prefix: string, existingCodes: string[]): string {
  const prefixPattern = new RegExp(`^${prefix}-(\\d+)$`);
  const numbers = existingCodes
    .map(code => {
      const match = code.match(prefixPattern);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null);

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
