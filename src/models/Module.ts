import { getDownloadURL, ref } from 'firebase/storage';
import { ModulePart } from './ModulePart';
import { useDataStore } from '@/stores/data';
import { storage } from '@/firebase';

export class Module {
  id: string;
  icon: string;
  image: string;
  file?: File;
  title: string;
  order: number;
  parts: Array<ModulePart>;
  [key: string]: any;

  constructor(id: string, icon: string, image: string, title: string, order: number, parts: Array<ModulePart>) {
    this.id = id;
    this.icon = icon;
    this.image = image;
    this.file = undefined;
    this.title = title;
    this.order = order;
    this.parts = parts;
  }

  increasePartOrder(partIndex: number) {
    if (partIndex !== 0) {
      let part = this.parts[partIndex];
      let previousPart = this.parts[partIndex - 1];
      this.parts[partIndex] = previousPart;
      this.parts[partIndex - 1] = part;
    }
  }

  decreasePartOrder(partIndex: number) {
    if (partIndex !== this.parts.length - 1) {
      let part = this.parts[partIndex];
      let nextPart = this.parts[partIndex + 1];
      this.parts[partIndex] = nextPart;
      this.parts[partIndex + 1] = part;
    }
  }

  deletePart(partIndex: number) {
    this.parts.splice(partIndex, 1);
  }

  addPart(part: ModulePart) {
    this.parts.push(part);
  }

  toJsonObject() {
    return {
      icon: this.icon,
      image: this.image,
      title: this.title,
      order: this.order,
      parts: this.parts.map((part) => part.toJsonObject())
    }
  }

  equals(module: Module) {
    return this.icon === module.icon
      && this.image === module.image
      && this.file === module.file
      && this.title === module.title
      && this.order === module.order
      && this.parts.length === module.parts.length
      && this.parts.every((part, index) => part.equals(module.parts[index]));
  }

  clone() {
    return new Module(
      this.id,
      this.icon,
      this.image,
      this.title,
      this.order,
      this.parts.map((part) => part.clone())
    );
  }

  async uploadImagesToFirebase(originModule: Module) {
    // Get the datastore
    const dataStore = useDataStore();

    // Check if the file property is defined
    if (this.file) {
      // Upload the file to firebase
      let newRef = `modules/${this.id}/${this.file.name}`
      await dataStore.uploadFileToFirebase(this.file, newRef, this.image)
      this.image = newRef
    }

    // Check if we need to delete image
    if (this.image == '' && originModule && this.image !== originModule.image) {
      // Delete the image from firebase
      await dataStore.deleteFileFromFirebase(originModule.image)
    }

    // Upload the images of the parts to firebase
    if (this.parts.length !== 0) {
      this.parts.forEach(async (part, index) => {
        await part.uploadImagesToFirebase(originModule.parts[index], this.id, index)
      })
    }
  }
}