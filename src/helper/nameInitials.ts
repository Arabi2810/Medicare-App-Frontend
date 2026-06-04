export function nameInitials(name: string) {
  if (!name) return '';
  const parts = name
    .trim()
    .split(/\s+/) // split by space(s)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  if (parts.length === 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // 3 or more words → first & last initials
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
