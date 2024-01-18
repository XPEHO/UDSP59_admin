import { defineStore } from 'pinia'
import { areMapsEqual } from '../utilities/functions';
import { modulesCollection, storage, tipsCollection, usersCollection } from '../firebase';
import { getDocs, getDoc, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { Account } from '../models/Account';
import { Module } from '../models/Module';
import { ModulePart } from '../models/ModulePart';
import { ModulePartElement } from '../models/ModulePartElement';
import router from '@/router';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';

interface DataState {
  tips: Array<string>
  accounts: Map<string, Account>
  modules: Map<string, Module>
  module: Module
  modulesEdited: Map<string, Module>
  accountsEdited: Map<string, Account>
  tipsEdited: Array<string>
  moduleEdited: Module
  currentRoute: RouteLocationNormalizedLoaded
  imageUrl: string
  toSave: boolean
}

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    tips: Array<string>(),
    accounts: new Map<string, Account>(),
    modules: new Map<string, Module>(),
    module: {} as Module,
    modulesEdited: new Map<string, Module>(),
    accountsEdited: new Map<string, Account>(),
    tipsEdited: Array<string>(),
    moduleEdited: {} as Module,
    currentRoute: {} as RouteLocationNormalizedLoaded,
    imageUrl: '',
    toSave: false,
  }),
  getters: {
    getTips: (state: DataState) => state.tips,
    getAccounts: (state: DataState) => state.accounts,
    getModules: (state: DataState) => state.modules,
    getModule: (state: DataState) => state.module,
    getModulesEdited: (state: DataState) => state.modulesEdited,
    getAccountsEdited: (state: DataState) => state.accountsEdited,
    getTipsEdited: (state: DataState) => state.tipsEdited,
    getModuleEdited: (state: DataState) => state.moduleEdited,
    getCurrentRoute: (state: DataState) => state.currentRoute,
    getImageUrl: (state: DataState) => state.imageUrl,
    needToSave: (state: DataState) => state.toSave,
  },
  actions: {
    // ------------------------------- RESET LOCAL DATAS -------------------------------
    reset() {
      this.tips = Array<string>();
      this.accounts = new Map<string, Account>();
      this.modules = new Map<string, Module>();
      this.module = {} as Module;
      this.modulesEdited = new Map<string, Module>();
      this.accountsEdited = new Map<string, Account>();
      this.tipsEdited = Array<string>();
      this.moduleEdited = {} as Module;
      this.imageUrl = '';
      this.toSave = false;
    },

    // ------------------------------ CHANGE LOCAL DATAS ------------------------------

    // --------------------- MODULES
    checkModulesEdition() {
      // Check if there is something to save
      if (!areMapsEqual(this.modules, this.modulesEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    checkModuleEdition() {
      // Check if there is something to save
      if (!this.moduleEdited.equals(this.module)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    addModule(module: Module) {
      // Check if title is already used
      let titleAlreadyUsed = false;
      for (let moduleCheck of this.modulesEdited.values()) {
        if (moduleCheck.title === module.title) {
          titleAlreadyUsed = true;
        }
      }
      // Change local datas to add module
      if (!titleAlreadyUsed) {
        this.modulesEdited.set(module.title, module);
        this.toSave = true;
      }
    },
    deleteModule(id: string) {
      // Change local datas to delete module
      this.modulesEdited.delete(id);
      // Update order
      let order = 0;
      for (let module of this.getSortedModules()) {
        order++;
        module.order = order;
      }
      // Check if there is something to save
      if (!areMapsEqual(this.modules, this.modulesEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    editModule(attribute: string, value: any) {
      // Change local datas to edit module
      this.moduleEdited[attribute] = value;
      // Check if there is something to save
      this.checkModuleEdition();
    },
    increaseModuleOrder(id: string) {
      // Change local datas to increase module order
      let module = this.modulesEdited.get(id);
      if (module && module.order !== 1) {
        for (let moduleToSwitch of this.modulesEdited.values()) {
          if (moduleToSwitch.order === module.order - 1) {
            moduleToSwitch.order++;
            break;
          }
        }
        module.order--;
        // Check if there is something to save
        this.checkModulesEdition();
      }
    },
    decreaseModuleOrder(id: string) {
      // Change local datas to decrease module order
      let module = this.modulesEdited.get(id);
      if (module && module.order !== this.modulesEdited.size) {
        for (let moduleToSwitch of this.modulesEdited.values()) {
          if (moduleToSwitch.order === module.order + 1) {
            moduleToSwitch.order--;
            break;
          }
        }
        module.order++;
        // Check if there is something to save
        this.checkModulesEdition();
      }
    },
    getSortedModules() {
      // Get sorted modules
      let sortedModules = Array.from(this.modulesEdited.values());
      sortedModules.sort((a, b) => a.order - b.order);
      return sortedModules;
    },

    // --------------------- TIPS
    checkTipsEdition() {
      // Check if there is something to save
      if (JSON.stringify(this.tips) !== JSON.stringify(this.tipsEdited)) {
        this.toSave = true;
      } else {
        this.toSave = false;
      }
    },
    addTip(tip: string) {
      // Change local datas to add tip
      this.tipsEdited.push(tip);
      // Check if there is something to save
      this.checkTipsEdition();
    },
    deleteTip(index: number) {
      // Change local datas to delete tip
      this.tipsEdited.splice(index, 1);
      // Check if there is something to save
      this.checkTipsEdition();
    },
    editTip(index: number, tip: string) {
      // Change local datas to edit tip
      this.tipsEdited[index] = tip;
      // Check if there is something to save
      this.checkTipsEdition();
    },

    // --------------------- ACCOUNTS
    checkAccountsEdition() {
      // Check if there is something to save
      if (!areMapsEqual(this.accounts, this.accountsEdited)) {
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
        this.checkAccountsEdition();
      }
    },
    deleteAccount(id: string) {
      // Change local datas to delete account
      this.accountsEdited.delete(id);
      // Check if there is something to save
      this.checkAccountsEdition();
    },
    editAccount(id: string, attribute: string, value: any) {
      // Change local datas to edit account
      let account = this.accountsEdited.get(id);
      if (account) {
        (account as { [key: string]: any })[attribute] = value;
      }
      // Check if there is something to save
      this.checkAccountsEdition();
    },

    // ------------------------- SEND LOCAL DATAS TO FIREBASE -------------------------
    saveModulesToFirebase: async function () {
      // Add new modules
      for (let [id, module] of this.modulesEdited.entries()) {
        if (!this.modules.has(id)) {
          // This is a new module
          await addDoc(modulesCollection, module.toJsonObject());
        } else {
          // This module has been edited
          await setDoc(doc(modulesCollection, id), module.toJsonObject());
        }
      }
      // Delete accounts
      for (let id of this.modules.keys()) {
        if (!this.modulesEdited.has(id)) {
          // This module has been deleted
          await deleteDoc(doc(modulesCollection, id));
        }
      }
      this.loadModulesFromFirebase();
    },
    saveModuleToFirebase: async function (id: string) {
      // Replace existing module
      await this.moduleEdited.uploadImagesToFirebase(this.module);
      await setDoc(doc(modulesCollection, id), this.moduleEdited.toJsonObject());
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
    uploadFileToFirebase: async function (file: File, newRef: string, oldRef: string) {
      // Create a storage reference
      let storageRef = ref(storage, newRef);

      // Upload the new file
      await uploadBytes(storageRef, file).then(async (snapshot) => {
        // Remove old file if exists
        if (oldRef !== '') {
          await this.deleteFileFromFirebase(oldRef);
        }
      }).catch((error) => {
        console.error(error)
      });
    },
    deleteFileFromFirebase: async function (oldRef: string) {
      // Delete the file from firebase
      let storageRef = ref(storage, oldRef)
      await deleteObject(storageRef)
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
          modulePart = new ModulePart(part.image, part.subtitle, modulePartElements);
          moduleParts.push(modulePart);

          modulePartElements = Array<ModulePartElement>();
        }
        let module = new Module(doc.id, doc.data().icon, doc.data().image, doc.data().title, doc.data().order, moduleParts);
        let moduleEdited = module.clone();
        this.modules.set(doc.id, module);
        this.modulesEdited.set(doc.id, moduleEdited);
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
          modulePart = new ModulePart(part.image, part.subtitle, modulePartElements);
          moduleParts.push(modulePart);

          modulePartElements = Array<ModulePartElement>();
        }
        this.module = new Module(doc.id, doc.data().icon, doc.data().image, doc.data().title, doc.data().order, moduleParts);
        this.moduleEdited = this.module.clone();
        await this.loadImageUrl();
      } else {
        // Module does not exist in Firestore collection, redirect on modules page
        router.replace({ name: 'Modules' });
      }
    },
    loadImageUrl: async function () {
      let module = this.moduleEdited
      let route = this.currentRoute

      // Get the url of the image
      let url
      if ('elt' in route.params) {
        let modulePart = module.parts[+route.params.part]
        let modulePartElement = modulePart.elements[+route.params.elt]
        if (modulePartElement.file) {
          url = URL.createObjectURL(modulePartElement.file)
        } else if (modulePartElement.image !== '') {
          url = await getDownloadURL(ref(storage, modulePartElement.image))
        } else {
          url = ''
        }
      } else if ('part' in route.params) {
        let modulePart = module.parts[+route.params.part]
        if (modulePart.file) {
          url = URL.createObjectURL(modulePart.file)
        } else if (modulePart.image !== '') {
          url = await getDownloadURL(ref(storage, modulePart.image))
        } else {
          url = ''
        }
      } else {
        if (module.file) {
          url = URL.createObjectURL(module.file)
        } else if (module.image !== '') {
          url = await getDownloadURL(ref(storage, module.image))
        } else {
          url = ''
        }
      }
      this.imageUrl = url
    },
  }
})
