import { defineStore } from "pinia";
import { provider, auth, usersCollection } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { query, where, getDocs } from "firebase/firestore";
import router from "@/router";
import { useMaterialIconsStore } from "./material-icons";
import { useDataStore } from "./data";
import { saveAlertPopup } from "@/components/SaveAlertPopup.vue";
import { unauthorizedAlertPopup } from "@/utilities/unauthorizedAlertPopup";

interface UserState {
  user: { email: string };
  admin: Boolean;
  loggedIn: Boolean;
}

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: { email: "" },
    admin: false,
    loggedIn: false,
  }),
  getters: {
    isAdmin: (state: UserState) => state.admin,
    getUser: (state: UserState) => state.user,
    isLoggedIn: (state: UserState) => state.loggedIn,
  },
  actions: {
    // ------------------------------- RESET LOCAL USER -------------------------------
    reset() {
      this.user = { email: "" };
      this.admin = false;
      this.loggedIn = false;
    },

    // ------------------------------- SWITCH CONNEXION -------------------------------
    async logout() {
      // Check if the user needs to save his changes
      const dataStore = useDataStore();
      if (dataStore.needToSave) {
        if (saveAlertPopup) {
          // Display the save alert popup
          saveAlertPopup.show();
          // Wait for the user to choose
          while (saveAlertPopup.continueChoice === null) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          // Check if the user wants to continue
          const shouldContinue = saveAlertPopup.continueChoice;
          saveAlertPopup.continueChoice = null;
          if (!shouldContinue) {
            return;
          }
        }
      }
      // Disconnect the user
      signOut(auth)
        .then(() => {
          this.reset();
          // Get the datas store
          const dataStore = useDataStore();
          dataStore.reset();
          router.replace({ name: "Login" });
        })
        .catch(() => {
          router.replace({ name: "Login" });
        });
    },

    loginWithGoogle() {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          this.user = result.user as { email: string };
          // Check if user is connected with Googleata
          if (this.user.email !== "") {
            const q = query(usersCollection, where("mail", "==", this.user.email));
            const snapshot = await getDocs(q);
            // Check if user email exists in Firestore collection
            if (!snapshot.empty) {
              // User email exists in Firestore collection
              // Load material icons
              const materialIconsStore = useMaterialIconsStore();
              await materialIconsStore.load();

              // keep user and connexion and redirect to modules page
              this.loggedIn = true;
              this.admin = snapshot.docs[0].data().admin;
              router.replace({ name: "Modules" });
            } else {
              // User email does not exist in Firestore collection, show unauthorized alert
              await auth.signOut();
              // Show the unauthorized alert popup
              if (unauthorizedAlertPopup) {
                unauthorizedAlertPopup.show();
              }
              router.replace({ name: "Login" });
            }
          } else {
            router.replace({ name: "Login" });
          }
        })
        .catch(() => {
          router.replace({ name: "Login" });
        });
    },
  },
});
