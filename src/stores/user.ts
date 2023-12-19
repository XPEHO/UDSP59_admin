import { defineStore } from 'pinia'
import { provider, auth, db } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore';
import router from '@/router';

interface UserState {
    user: { email: string }
    admin: Boolean
    loggedIn: Boolean
}

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: { email: '' },
        admin: false,
        loggedIn: false,
    }),
    getters: {
        isAdmin: (state: UserState) => state.admin,
        getUser: (state: UserState) => state.user,
        isLoggedIn: (state: UserState) => state.loggedIn,
    },
    actions: {
        reset() {
            this.user = { email: '' };
            this.admin = false;
            this.loggedIn = false;
        },

        logout() {
            signOut(auth)
                .then((result) => {
                    this.reset();
                    router.replace({ name: 'Login' });
                }).catch((error) => {
                    router.replace({ name: 'Login' });
                });
        },

        loginWithGoogle() {
            signInWithPopup(auth, provider)
                .then(async (result) => {
                    this.user = result.user as { email: string };
                    // Check if user is connected with Googleata
                    if (this.user.email !== '') {
                        const q = query(collection(db, "users"), where("mail", "==", this.user.email));
                        const snapshot = await getDocs(q);
                        // Check if user email exists in Firestore collection
                        if (!snapshot.empty) {
                            // User email exists in Firestore collection, keep user and connexion and redirect to modules page
                            this.loggedIn = true;
                            this.admin = snapshot.docs[0].data().admin;
                            router.replace({ name: 'Modules' });
                        } else {
                            // User email does not exist in Firestore collection, sign out and return error
                            await auth.signOut();
                            router.replace({ name: 'Login' });
                        }
                    } else {
                        router.replace({ name: 'Login' });
                    }
                }).catch((error) => {
                    router.replace({ name: 'Login' });
                });
        },
    }
})
