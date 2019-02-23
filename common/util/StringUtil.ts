export function isWhitespace(text: string): boolean {
  return !/[^\s]/.test(text);
}
