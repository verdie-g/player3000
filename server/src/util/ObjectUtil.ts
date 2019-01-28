export function getOr(obj: any, key: string, or: any) {
  if (key in obj) {
    return obj[key];
  }
  return or;
}
