import { defineStore } from 'pinia'
import { useUserStore } from '../stores/user'
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { Tip } from '../models/Tip';
import { Account } from '../models/Account';
import { Module } from '../models/Module';
import { ModulePart } from '../models/ModulePart';
import { ModulePartElement } from '../models/ModulePartElement';

interface DataState {
    tips: Array<Tip>
    accounts: Array<Account>
    modules: Array<Module>
}

export const useDataStore = defineStore('dataStore', {
    state: () => ({
        tips: Array<Tip>(),
        accounts: Array<Account>(),
        modules: Array<Module>()
    }),
    getters: {
        getTips: (state: DataState) => state.tips,
        getAccounts: (state: DataState) => state.accounts,
        getModules: (state: DataState) => state.modules
    },
    actions: {
        reset() {
            this.tips = Array<Tip>();
            this.accounts = Array<Account>();
            this.modules = Array<Module>();
        },

        loadTipsFromFirebase: async function () {
            // Reset
            this.reset();
            // Get from firebase
            const tipsQ = query(collection(db, "tips"));
            const tipsSnapshot = await getDocs(tipsQ);
            // Add to array
            tipsSnapshot.forEach((doc) => {
                let tip = new Tip(doc.data().content);
                this.tips.push(tip);
            });
        },
        loadAccountsFromFirebase: async function () {
            // Reset
            this.reset();
            // Get from firebase
            const accountsQ = query(collection(db, "users"));
            const accountsSnapshot = await getDocs(accountsQ);
            // Add to array
            accountsSnapshot.forEach((doc) => {
                let account = new Account(doc.data().mail, doc.data().admin);
                this.accounts.push(account);
            });
        },
        loadModulesFromFirebase: async function () {
            // Reset
            this.reset();
            // Get from firebase
            const modulesQ = query(collection(db, "modules"));
            const modulesSnapshot = await getDocs(modulesQ);
            // Add to array
            modulesSnapshot.forEach((doc) => {
                let modulePartElements = Array<ModulePartElement>();
                let moduleParts = Array<ModulePart>();

                for (let part of doc.data().parts) {
                    for (let element of part.elements) {
                        let modulePartElement = new ModulePartElement(element.content, element.type);
                        modulePartElements.push(modulePartElement);
                    }
                    let modulePart = new ModulePart(part.image, part.order, part.subtitle, modulePartElements);
                    moduleParts.push(modulePart);
                }
                let module = new Module(doc.data().icon, doc.data().image, doc.data().title, moduleParts);
                this.modules.push(module);
            });
        },

    }
})
