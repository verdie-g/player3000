export function getOr(obj: any, key: string, or: any) {
  if (key in obj) {
    return obj[key];
  }
  return or;
}

export function copyValues(dst: any, src: any): any {
  Object.keys(src).forEach((key: string) => {
    dst[key] = src[key];
  });
  return dst;
}
