import { reactive } from "vue";

// Public access to show function
export const unauthorizedAlertPopup = reactive({
  show: () => {},
  setShowFunction(show: () => void) {
    this.show = show;
  },
});
