import { useDataStore } from "@/stores/data";
import { ModulePartElement } from "./ModulePartElement";
import { generateRandomId } from "@/utilities/functions";

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
    // Get the datastore
    const dataStore = useDataStore();
    // Mark the image to be deleted
    const imageRef = this.elements[eltIndex].image;
    if (imageRef !== "") dataStore.imagesToDelete.push(imageRef);
    // Delete the element
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

  getAllImages() {
    let images = this.image !== "" ? [this.image] : [];
    for (const element of this.elements) {
      if (element.image !== "") images = images.concat([element.image]);
    }
    return images;
  }

  async uploadImagesToFirebase(originPart: ModulePart) {
    // Get the datastore
    const dataStore = useDataStore();

    // Check if the file property is defined
    if (this.file) {
      // Generate a new reference by a generated id and the same extension of the file
      const newRef = generateRandomId() + this.file.name.slice(this.file.name.lastIndexOf("."));
      // Upload the file to firebase
      await dataStore.uploadFileToFirebase(this.file, newRef);
      // Mark the old reference to be deleted
      if (this.image !== "") dataStore.imagesToDelete.push(this.image);
      // Set the new reference to the image property
      this.image = newRef;
    }

    // Check if we need to delete image, so if the new image is empty and the origin part is the same but with an image
    if (
      this.image == "" &&
      originPart &&
      this.image !== originPart.image &&
      this.subtitle === originPart.subtitle
    ) {
      // Mark the image to be deleted
      dataStore.imagesToDelete.push(originPart.image);
    }

    // Upload the images of the elements to firebase
    if (this.elements.length !== 0) {
      await Promise.all(
        this.elements.map((element, eltIndex) => {
          return element.uploadImagesToFirebase(originPart.elements[eltIndex]);
        }),
      );
    }
  }
}
