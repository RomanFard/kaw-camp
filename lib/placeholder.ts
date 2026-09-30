export function getProductPlaceholder(
  name: string,
  emoji: string = "📦",
  color: string = "#F7F1E3"
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="${color}"/>
      <rect x="20" y="20" width="560" height="560" rx="30" fill="none" stroke="#E8DFC8" stroke-width="4" stroke-dasharray="12 8"/>
      <text x="300" y="290" font-size="140" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      <text x="300" y="420" font-size="26" text-anchor="middle" fill="#6B7280" font-family="sans-serif" font-weight="bold">${name}</text>
    </svg>
  `;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}