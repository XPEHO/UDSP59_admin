import { reactive } from "vue";

function areMapsEqual(map1: Map<any, any>, map2: Map<any, any>): boolean {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, value] of map1) {
    const testValue = map2.get(key);
    // Key does not exist in map2 or value is different
    if (!testValue.equals(value)) {
      return false;
    }
  }
  return true;
}

// Function to generate a random id composed by 8 alphanumeric characters
function generateRandomId(): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


// Public access to show function
export const unauthorizedAlertPopup = reactive({
  show: () => {},
  setShowFunction(show: () => void) {
    this.show = show;
  },
});

export { areMapsEqual, generateRandomId };
