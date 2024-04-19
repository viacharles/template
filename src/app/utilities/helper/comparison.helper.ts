

/** 物件深層比較 */
export function objectDeepCompare(obj1: any, obj2: any): boolean {
  if(typeof obj1 !== 'object' || typeof obj2 !== 'object') {return false };
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) { return false };
  for (let key of keys1) {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!objectDeepCompare(obj1[key], obj2[key])) { return false };
    } else if (obj1[key] !== obj2[key]) { return false };
  };
  return true;
}
