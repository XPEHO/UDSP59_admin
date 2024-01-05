
function areMapsEqual(map1: Map<any, any>, map2: Map<any, any>): boolean {
  if (map1.size !== map2.size) {
    return false;
  }
  for (let [key, value] of map1) {
    let testValue = map2.get(key);
    // Key does not exist in map2 or value is different
    if (!testValue.equals(value)) {
      return false;
    }
  }
  return true;
}

export { areMapsEqual }
