import { defineStore } from 'pinia'
import { db } from '../firebase';
import { collection, getDocs, getDoc, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
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
  accountsToAdd: Map<string, Account>
  accountsToDelete: Array<string>
  accountsToEdit: Map<string, Account>
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
    accountsToAdd: new Map<string, Account>(),
    accountsToDelete: Array<string>(),
    accountsToEdit: new Map<string, Account>(),
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
    getAccountsToAdd: (state: DataState) => state.accountsToAdd,
    getAccountsToDelete: (state: DataState) => state.accountsToDelete,
    getAccountsToEdit: (state: DataState) => state.accountsToEdit,
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
      this.accountsToAdd = new Map<string, Account>();
      this.accountsToDelete = Array<string>();
      this.accountsToEdit = new Map<string, Account>();
      this.tipsEdited = Array<string>();
      this.toSave = false;
    },

    // ------------------------------ CHANGE LOCAL DATAS ------------------------------
    addModule(module: Module) {
      this.modules.set(module.title, module);
      this.modulesToAdd.set(module.title, module);
      this.toSave = true;
    },
    deleteModule(id: string) {
      if (this.modules.has(id)) {
        this.modules.delete(id);
        if (this.modulesToAdd.has(id)) {
          this.modulesToAdd.delete(id);
        } else {
          this.modulesToDelete.push(id);
        }
      }
      if (this.modulesToAdd.size == 0 && this.modulesToDelete.length == 0) {
        this.toSave = false;
      } else {
        this.toSave = true;
      }
    },
    addTip(tip: string) {
      this.tipsEdited.push(tip);
      this.toSave = true;
      if (JSON.stringify(this.tips) !== JSON.stringify(this.tipsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    deleteTip(index: number) {
      this.tipsEdited.splice(index, 1);
      if (JSON.stringify(this.tips) !== JSON.stringify(this.tipsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    editTip(index: number, tip: string) {
      this.tipsEdited[index] = tip;
      if (JSON.stringify(this.tips) !== JSON.stringify(this.tipsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    addAccount(account: Account) {
      this.accounts.set(account.mail, account);
      this.accountsToAdd.set(account.mail, account);
      this.toSave = true;
    },
    deleteAccount(id: string) {
      if (this.accounts.has(id)) {
        this.accounts.delete(id);
        if (this.accountsToAdd.has(id)) {
          this.accountsToAdd.delete(id);
        } else {
          this.accountsToDelete.push(id);
        }
      }
      if (this.accountsToAdd.size == 0 && this.accountsToDelete.length == 0 && this.accountsToEdit.size == 0) {
        this.toSave = false;
      } else {
        this.toSave = true;
      }
    },
    editAccount(id: string, account: Account) {
      if (this.accountsToAdd.has(id)) {
        this.accountsToAdd.set(id, account);
      } else if (this.accounts.has(id)) {
        this.accountsToEdit.set(id, account);
        if (this.accounts.get(id)?.mail === account.mail) {
          this.accountsToEdit.delete(id);
        }
      }
      if (this.accountsToAdd.size == 0 && this.accountsToDelete.length == 0 && this.accountsToEdit.size == 0) {
        this.toSave = false;
      } else {
        this.toSave = true;
      }

    },

    // ------------------------- SEND LOCAL DATAS TO FIREBASE -------------------------
    saveModulesToFirebase: async function () {
      // Add new modules
      for (let module of this.modulesToAdd.values()) {
        await addDoc(collection(db, "modules"), module.toJsonObject());
      }
      // Delete modules
      for (let id of this.modulesToDelete) {
        await deleteDoc(doc(db, "modules", id));
      }
      this.loadModulesFromFirebase();
    },
    saveModuleToFirebase: async function (id: string) {
      // Replace existing module
      await setDoc(doc(db, "modules", id), this.module.toJsonObject());
      this.loadModuleFromFirebase(id);
    },
    saveTipsToFirebase: async function () {
      // Replace existing tips
      await setDoc(doc(db, "tips", "tips"), { content: this.tipsEdited });
      this.loadTipsFromFirebase();
    },
    saveAccountsToFirebase: async function () {
      // Add new tips
      for (let account of this.accountsToAdd.values()) {
        await addDoc(collection(db, "accounts"), account.toJsonObject());
      }
      // Delete tips
      for (let id of this.accountsToDelete) {
        await deleteDoc(doc(db, "accounts", id));
      }
      // Edit tips
      for (let [id, account] of this.accountsToEdit) {
        await setDoc(doc(db, "accounts", id), account.toJsonObject());
      }
      this.loadAccountsFromFirebase();
    },

    // ------------------------- LOAD FIREBASE DATAS TO LOCAL -------------------------
    loadTipsFromFirebase: async function () {
      // Reset
      this.reset();
      // Get from firebase
      const tipsSnapshot = await getDoc(doc(db, "tips", "tips"));
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
      const accountsSnapshot = await getDocs(collection(db, "users"));
      // Add to array
      accountsSnapshot.forEach((doc) => {
        let account = new Account(doc.data().mail, doc.data().admin);
        this.accounts.set(doc.id, account);
      });
    },
    loadModulesFromFirebase: async function () {
      // Reset
      this.reset();
      // Get from firebase
      const modulesSnapshot = await getDocs(collection(db, "modules"));
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
      const moduleSnapshot = await getDoc(doc(db, "modules", id));
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
