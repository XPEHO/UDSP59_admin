import { useDataStore } from "@/stores/data";
import { generateRandomId } from "@/utilities/functions";

export class ModulePartElement {
  image: string;
  file?: File;
  text: string;
  [key: string]: any;

  constructor(image: string, text: string) {
    this.image = image;
    this.file = undefined;
    this.text = text;
  }

  toJsonObject() {
    return {
      image: this.image,
      text: this.text,
    };
  }

  equals(element: ModulePartElement) {
    return this.image === element.image && this.file === element.file && this.text === element.text;
  }

  clone() {
    return new ModulePartElement(this.image, this.text);
  }

  async uploadImagesToFirebase(originElement: ModulePartElement) {
    // Get the datastore
    const dataStore = useDataStore();

    // Check if the file property is defined
    if (this.file) {
      // Generate a new reference by a generated id and the same extension of the file
      const newRef = generateRandomId() + this.file.name.slice(this.file.name.lastIndexOf("."));
      // Upload the file to firebase
      await dataStore.uploadFileToFirebase(this.file, newRef, this.image);
      this.image = newRef;
    }

    // Check if we need to delete image
    if (this.image == "" && originElement && this.image !== originElement.image) {
      // Delete the image from firebase
      await dataStore.deleteFileFromFirebase(originElement.image);
    }
  }
}
