import { defineStore } from 'pinia'
import { areMapsEqual } from '../utilities/functions';
import { modulesCollection, tipsCollection, usersCollection } from '../firebase';
import { getDocs, getDoc, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { Account } from '../models/Account';
import { Module } from '../models/Module';
import { ModulePart } from '../models/ModulePart';
import { ModulePartElement } from '../models/ModulePartElement';
import router from '@/router';

interface DataState {
  tips: Array<string>
  accounts: Map<string, Account>
  modules: Map<string, Module>
  module: Module
  modulesToAdd: Map<string, Module>
  modulesToDelete: Array<string>
  accountsEdited: Map<string, Account>
  tipsEdited: Array<string>
  toSave: boolean
}

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    tips: Array<string>(),
    accounts: new Map<string, Account>(),
    modules: new Map<string, Module>(),
    module: {} as Module,
    modulesToAdd: new Map<string, Module>(),
    modulesToDelete: Array<string>(),
    accountsEdited: new Map<string, Account>(),
    tipsEdited: Array<string>(),
    toSave: false,
  }),
  getters: {
    getTips: (state: DataState) => state.tips,
    getAccounts: (state: DataState) => state.accounts,
    getModules: (state: DataState) => state.modules,
    getModule: (state: DataState) => state.module,
    getModulesToAdd: (state: DataState) => state.modulesToAdd,
    getModulesToDelete: (state: DataState) => state.modulesToDelete,
    getAccountsEdited: (state: DataState) => state.accountsEdited,
    getTipsEdited: (state: DataState) => state.tipsEdited,
    needToSave: (state: DataState) => state.toSave,
  },
  actions: {
    // ------------------------------- RESET LOCAL DATAS -------------------------------
    reset() {
      this.tips = Array<string>();
      this.accounts = new Map<string, Account>();
      this.modules = new Map<string, Module>();
      this.module = {} as Module;
      this.modulesToAdd = new Map<string, Module>();
      this.modulesToDelete = Array<string>();
      this.accountsEdited = new Map<string, Account>();
      this.tipsEdited = Array<string>();
      this.toSave = false;
    },

    // ------------------------------ CHANGE LOCAL DATAS ------------------------------
    addModule(module: Module) {
      // Change local datas to add module
      this.modules.set(module.title, module);
      this.modulesToAdd.set(module.title, module);
      // Notice that there is something to save
      this.toSave = true;
    },
    deleteModule(id: string) {
      // Change local datas to delete module
      if (this.modules.has(id)) {
        this.modules.delete(id);
        if (this.modulesToAdd.has(id)) {
          this.modulesToAdd.delete(id);
        } else {
          this.modulesToDelete.push(id);
        }
      }
      // Check if there is something to save
      if (this.modulesToAdd.size == 0 && this.modulesToDelete.length == 0) {
        this.toSave = false;
      } else {
        this.toSave = true;
      }
    },
    addTip(tip: string) {
      // Change local datas to add tip
      this.tipsEdited.push(tip);
      // Check if there is something to save
      if (JSON.stringify(this.tips) !== JSON.stringify(this.tipsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    deleteTip(index: number) {
      // Change local datas to delete tip
      this.tipsEdited.splice(index, 1);
      // Check if there is something to save
      if (JSON.stringify(this.tips) !== JSON.stringify(this.tipsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    editTip(index: number, tip: string) {
      // Change local datas to edit tip
      this.tipsEdited[index] = tip;
      // Check if there is something to save
      if (JSON.stringify(this.tips) !== JSON.stringify(this.tipsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    addAccount(account: Account) {
      // Check if mail is already used
      let mailAlreadyUsed = false;
      for (let accountCheck of this.accountsEdited.values()) {
        if (accountCheck.mail === account.mail) {
          mailAlreadyUsed = true;
        }
      }
      // Change local datas to add account
      if (!mailAlreadyUsed) {
        this.accountsEdited.set(account.mail, account);
        // Check if there is something to save
        if (!areMapsEqual(this.accounts, this.accountsEdited)) {
          this.toSave = true;
        } else {
          this.toSave = false;
        }
      }
    },
    deleteAccount(id: string) {
      // Change local datas to delete account
      this.accountsEdited.delete(id);
      // Check if there is something to save
      if (!areMapsEqual(this.accounts, this.accountsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    editAccount(id: string, attribute: string, value: any) {
      // Change local datas to edit account
      let account = this.accountsEdited.get(id);
      if (account) {
        (account as { [key: string]: any })[attribute] = value;
      }
      // Check if there is something to save
      if (!areMapsEqual(this.accounts, this.accountsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },

    // ------------------------- SEND LOCAL DATAS TO FIREBASE -------------------------
    saveModulesToFirebase: async function () {
      // Add new modules
      for (let module of this.modulesToAdd.values()) {
        await addDoc(modulesCollection, module.toJsonObject());
      }
      // Delete modules
      for (let id of this.modulesToDelete) {
        await deleteDoc(doc(modulesCollection, id));
      }
      this.loadModulesFromFirebase();
    },
    saveModuleToFirebase: async function (id: string) {
      // Replace existing module
      await setDoc(doc(modulesCollection, id), this.module.toJsonObject());
      this.loadModuleFromFirebase(id);
    },
    saveTipsToFirebase: async function () {
      // Replace existing tips
      await setDoc(doc(tipsCollection, "tips"), { content: this.tipsEdited });
      this.loadTipsFromFirebase();
    },
    saveAccountsToFirebase: async function () {
      // Add new accounts and edit existing accounts
      for (let [id, account] of this.accountsEdited.entries()) {
        if (!this.accounts.has(id)) {
          // This is a new account
          await addDoc(usersCollection, account.toJsonObject());
        } else if (!this.accounts.get(id)?.equals(account)) {
          // This account has been edited
          await setDoc(doc(usersCollection, id), account.toJsonObject());
        }
      }

      // Delete accounts
      for (let id of this.accounts.keys()) {
        if (!this.accountsEdited.has(id)) {
          // This account has been deleted
          await deleteDoc(doc(usersCollection, id));
        }
      }
      this.loadAccountsFromFirebase();
    },

    // ------------------------- LOAD FIREBASE DATAS TO LOCAL -------------------------
    loadTipsFromFirebase: async function () {
      // Reset
      this.reset();
      // Get from firebase
      const tipsSnapshot = await getDoc(doc(tipsCollection, "tips"));
      // Add to array
      if (tipsSnapshot.exists()) {
        for (let tip of tipsSnapshot.data().content) {
          this.tips.push(tip);
          this.tipsEdited.push(tip);
        }
      } else {
        // Tips does not exist in Firestore collection, redirect on modules page
        router.replace({ name: 'Modules' });
      }
    },
    loadAccountsFromFirebase: async function () {
      // Reset
      this.reset();
      // Get from firebase
      const accountsSnapshot = await getDocs(usersCollection);
      // Add to array
      accountsSnapshot.forEach((doc) => {
        let account = new Account(doc.data().mail, doc.data().admin);
        let accountEdited = new Account(account.mail, account.admin);
        this.accounts.set(doc.id, account);
        this.accountsEdited.set(doc.id, accountEdited);
      });
    },
    loadModulesFromFirebase: async function () {
      // Reset
      this.reset();
      // Get from firebase
      const modulesSnapshot = await getDocs(modulesCollection);
      // Add to array
      modulesSnapshot.forEach((doc) => {
        let modulePartElements = Array<ModulePartElement>();
        let moduleParts = Array<ModulePart>();
        let modulePart = {} as ModulePart;
        let modulePartElement = {} as ModulePartElement;

        for (let part of doc.data().parts) {
          for (let element of part.elements) {
            modulePartElement = new ModulePartElement(element.image, element.text);
            modulePartElements.push(modulePartElement);
          }
          modulePart = new ModulePart(part.image, part.order, part.subtitle, modulePartElements);
          moduleParts.push(modulePart);
          modulePartElements = Array<ModulePartElement>();
        }
        let module = new Module(doc.data().icon, doc.data().image, doc.data().title, moduleParts);
        this.modules.set(doc.id, module);
        moduleParts = Array<ModulePart>();
      });
    },
    loadModuleFromFirebase: async function (id: string) {
      // Reset
      this.reset();
      // Get from firebase
      const moduleSnapshot = await getDoc(doc(modulesCollection, id));
      // Check if module exists in Firestore collection
      if (moduleSnapshot.exists()) {
        let doc = moduleSnapshot;
        // Module exists in Firestore collection, we can load it
        let modulePartElements = Array<ModulePartElement>();
        let moduleParts = Array<ModulePart>();
        let modulePart = {} as ModulePart;
        let modulePartElement = {} as ModulePartElement;

        for (let part of doc.data().parts) {
          for (let element of part.elements) {
            modulePartElement = new ModulePartElement(element.image, element.text);
            modulePartElements.push(modulePartElement);
          }
          modulePart = new ModulePart(part.image, part.order, part.subtitle, modulePartElements);
          moduleParts.push(modulePart);
          modulePartElements = Array<ModulePartElement>();
        }
        this.module = new Module(doc.data().icon, doc.data().image, doc.data().title, moduleParts);
        moduleParts = Array<ModulePart>();
      } else {
        // Module does not exist in Firestore collection, redirect on modules page
        router.replace({ name: 'Modules' });
      }
    },
  }
})
