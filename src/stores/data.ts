import { defineStore } from 'pinia'
import { db } from '../firebase';
import { collection, getDocs, getDoc, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { Tip } from '../models/Tip';
import { Account } from '../models/Account';
import { Module } from '../models/Module';
import { ModulePart } from '../models/ModulePart';
import { ModulePartElement } from '../models/ModulePartElement';
import router from '@/router';

interface DataState {
  tips: Array<Tip>
  accounts: Array<Account>
  modules: Map<string, Module>
  module: Module
  modulesToAdd: Map<string, Module>
  modulesToDelete: Array<string>
  toSave: boolean
}

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    tips: Array<Tip>(),
    accounts: Array<Account>(),
    modules: new Map<string, Module>(),
    module: {} as Module,
    modulesToAdd: new Map<string, Module>(),
    modulesToDelete: Array<string>(),
    toSave: false,
  }),
  getters: {
    getTips: (state: DataState) => state.tips,
    getAccounts: (state: DataState) => state.accounts,
    getModules: (state: DataState) => state.modules,
    getModule: (state: DataState) => state.module,
    getModulesToAdd: (state: DataState) => state.modulesToAdd,
    getModulesToDelete: (state: DataState) => state.modulesToDelete,
    needToSave: (state: DataState) => state.toSave,
  },
  actions: {
    // ------------------------------- RESET LOCAL DATAS -------------------------------
    reset() {
      this.tips = Array<Tip>();
      this.accounts = Array<Account>();
      this.modules = new Map<string, Module>();
      this.module = {} as Module;
      this.modulesToAdd = new Map<string, Module>();
      this.modulesToDelete = Array<string>();
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
      await setDoc(doc(db, "modules", id), this.module.toJsonObject());
      this.loadModuleFromFirebase(id);
    },

    // ------------------------- LOAD FIREBASE DATAS TO LOCAL -------------------------
    loadTipsFromFirebase: async function () {
      // Reset
      this.reset();
      // Get from firebase
      const tipsSnapshot = await getDocs(collection(db, "tips"));
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
      const accountsSnapshot = await getDocs(collection(db, "users"));
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
