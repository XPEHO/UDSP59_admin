import { useDataStore } from "@/stores/data";
import { ModulePartElement } from "./ModulePartElement";

export class ModulePart {
  image: string;
  file?: File;
  subtitle: string;
  elements: Array<ModulePartElement>;
  [key: string]: any;

  constructor(image: string, subtitle: string, elements: Array<ModulePartElement>) {
    this.image = image;
    this.file = undefined;
    this.subtitle = subtitle;
    this.elements = elements;
  }

  increaseElementOrder(eltIndex: number) {
    if (eltIndex !== 0) {
      const elt = this.elements[eltIndex];
      const previousElt = this.elements[eltIndex - 1];
      this.elements[eltIndex] = previousElt;
      this.elements[eltIndex - 1] = elt;
    }
  }

  decreaseElementOrder(eltIndex: number) {
    if (eltIndex !== this.elements.length - 1) {
      const elt = this.elements[eltIndex];
      const nextElt = this.elements[eltIndex + 1];
      this.elements[eltIndex] = nextElt;
      this.elements[eltIndex + 1] = elt;
    }
  }

  deleteElement(eltIndex: number) {
    this.elements.splice(eltIndex, 1);
  }

  addElement(element: ModulePartElement) {
    this.elements.push(element);
  }

  toJsonObject() {
    return {
      image: this.image,
      subtitle: this.subtitle,
      elements: this.elements.map((element) => element.toJsonObject()),
    };
  }

  equals(part: ModulePart) {
    return (
      this.image === part.image &&
      this.file === part.file &&
      this.subtitle === part.subtitle &&
      this.elements.length === part.elements.length &&
      this.elements.every((element, index) => element.equals(part.elements[index]))
    );
  }

  clone() {
    return new ModulePart(
      this.image,
      this.subtitle,
      this.elements.map((element) => element.clone()),
    );
  }

  async uploadImagesToFirebase(originPart: ModulePart, id: string, index: number) {
    // Get the datastore
    const dataStore = useDataStore();

    // Check if the file property is defined
    if (this.file) {
      // Upload the file to firebase
      const newRef = `modules/${id}/${index}/${this.file.name}`;
      await dataStore.uploadFileToFirebase(this.file, newRef, this.image);
      this.image = newRef;
    }

    // Check if we need to delete image
    if (this.image == "" && originPart && this.image !== originPart.image) {
      // Delete the image from firebase
      await dataStore.deleteFileFromFirebase(originPart.image);
    }

    // Upload the images of the elements to firebase
    if (this.elements.length !== 0) {
      await Promise.all(
        this.elements.map((element, eltIndex) => {
          return element.uploadImagesToFirebase(originPart.elements[eltIndex], id, index, eltIndex);
        }),
      );
    }
  }
}
