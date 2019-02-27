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

export function uriEncode(obj: any) {
  const str: string[] = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  return str.join('&');
}
