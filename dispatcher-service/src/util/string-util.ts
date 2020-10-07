
export function toJson(map: Map<String, String>): String {
  return JSON.stringify(Array.from(map.entries()));
}


export function parseCsvString(value: string, defaultValue?: string): string[] {
  if (value) {
    return value.split(',').map(v => v.trim());
  }
  return defaultValue ? [defaultValue] : [];
}


export function elementExists(jsonObject, element): boolean {
  var parts = element.split(".");
  var curElement = parts.shift();
  if(jsonObject.hasOwnProperty(curElement)) {
    if(parts.length > 0) {
      return this.elementExists(jsonObject[curElement],parts.join("."));
    } else {
      return true;
    }
  } else {
    return false;
  }
}