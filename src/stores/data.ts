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
  tips: Map<string, Tip>
  accounts: Map<string, Account>
  modules: Map<string, Module>
  module: Module
  modulesToAdd: Map<string, Module>
  modulesToDelete: Array<string>
  tipsToAdd: Map<string, Tip>
  tipsToDelete: Array<string>
  tipsToEdit: Map<string, Tip>
  toSave: boolean
}

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    tips: new Map<string, Tip>(),
    accounts: new Map<string, Account>(),
    modules: new Map<string, Module>(),
    module: {} as Module,
    modulesToAdd: new Map<string, Module>(),
    modulesToDelete: Array<string>(),
    tipsToAdd: new Map<string, Tip>(),
    tipsToDelete: Array<string>(),
    tipsToEdit: new Map<string, Tip>(),
    toSave: false,
  }),
  getters: {
    getTips: (state: DataState) => state.tips,
    getAccounts: (state: DataState) => state.accounts,
    getModules: (state: DataState) => state.modules,
    getModule: (state: DataState) => state.module,
    getModulesToAdd: (state: DataState) => state.modulesToAdd,
    getModulesToDelete: (state: DataState) => state.modulesToDelete,
    getTipsToAdd: (state: DataState) => state.tipsToAdd,
    getTipsToDelete: (state: DataState) => state.tipsToDelete,
    getTipsToEdit: (state: DataState) => state.tipsToEdit,
    needToSave: (state: DataState) => state.toSave,
  },
  actions: {
    // ------------------------------- RESET LOCAL DATAS -------------------------------
    reset() {
      this.tips = new Map<string, Tip>();
      this.accounts = new Map<string, Account>();
      this.modules = new Map<string, Module>();
      this.module = {} as Module;
      this.modulesToAdd = new Map<string, Module>();
      this.modulesToDelete = Array<string>();
      this.tipsToAdd = new Map<string, Tip>();
      this.tipsToDelete = Array<string>();
      this.tipsToEdit = new Map<string, Tip>();
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
    addTip(tip: Tip) {
      this.tips.set(tip.content, tip);
      this.tipsToAdd.set(tip.content, tip);
      this.toSave = true;
    },
    deleteTip(id: string) {
      if (this.tips.has(id)) {
        this.tips.delete(id);
        if (this.tipsToAdd.has(id)) {
          this.tipsToAdd.delete(id);
        } else {
          this.tipsToDelete.push(id);
        }
      }
      if (this.tipsToAdd.size == 0 && this.tipsToDelete.length == 0 && this.tipsToEdit.size == 0) {
        this.toSave = false;
      } else {
        this.toSave = true;
      }
    },
    editTip(id: string, tip: Tip) {
      if (this.tipsToAdd.has(id)) {
        this.tipsToAdd.set(id, tip);
      } else if (this.tips.has(id)) {
        this.tipsToEdit.set(id, tip);
        if (this.tips.get(id)?.content === tip.content) {
          this.tipsToEdit.delete(id);
        }
      }
      if (this.tipsToAdd.size == 0 && this.tipsToDelete.length == 0 && this.tipsToEdit.size == 0) {
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
      // Add new tips
      for (let tip of this.tipsToAdd.values()) {
        await addDoc(collection(db, "tips"), tip.toJsonObject());
      }
      // Delete tips
      for (let id of this.tipsToDelete) {
        await deleteDoc(doc(db, "tips", id));
      }
      // Edit tips
      for (let [id, tip] of this.tipsToEdit) {
        await setDoc(doc(db, "tips", id), tip.toJsonObject());
      }
      this.loadTipsFromFirebase();
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
        this.tips.set(doc.id, tip);
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
