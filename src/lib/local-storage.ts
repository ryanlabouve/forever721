
export function readLS(key): string {
  if (typeof localStorage === 'undefined') return;
  const i = localStorage.getItem(key);
  return i && JSON.parse(i);
}

export function writeLS(key, value): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, value);
}