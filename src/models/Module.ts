import { generateRandomId } from "@/utilities/functions";
import { ModulePart } from "./ModulePart";
import { useDataStore } from "@/stores/data";

export class Module {
  id: string;
  icon: string;
  image: string;
  file?: File;
  title: string;
  order: number;
  parts: Array<ModulePart>;
  [key: string]: any;

  constructor(
    id: string,
    icon: string,
    image: string,
    title: string,
    order: number,
    parts: Array<ModulePart>,
  ) {
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
      const part = this.parts[partIndex];
      const previousPart = this.parts[partIndex - 1];
      this.parts[partIndex] = previousPart;
      this.parts[partIndex - 1] = part;
    }
  }

  decreasePartOrder(partIndex: number) {
    if (partIndex !== this.parts.length - 1) {
      const part = this.parts[partIndex];
      const nextPart = this.parts[partIndex + 1];
      this.parts[partIndex] = nextPart;
      this.parts[partIndex + 1] = part;
    }
  }

  deletePart(partIndex: number) {
    // Get the datastore
    const dataStore = useDataStore();
    // Mark the images to be deleted
    for (const imageRef of this.parts[partIndex].getAllImages()) {
      dataStore.imagesToDelete.push(imageRef);
    }
    // Delete the part
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
      parts: this.parts.map((part) => part.toJsonObject()),
    };
  }

  equals(module: Module) {
    return (
      this.icon === module.icon &&
      this.image === module.image &&
      this.file === module.file &&
      this.title === module.title &&
      this.order === module.order &&
      this.parts.length === module.parts.length &&
      this.parts.every((part, index) => part.equals(module.parts[index]))
    );
  }

  clone() {
    return new Module(
      this.id,
      this.icon,
      this.image,
      this.title,
      this.order,
      this.parts.map((part) => part.clone()),
    );
  }

  getAllImages() {
    let images = this.image !== "" ? [this.image] : [];
    this.parts.forEach((part) => {
      images = images.concat(part.getAllImages());
    });
    return images;
  }

  async uploadImagesToFirebase(originModule: Module) {
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
      originModule &&
      this.image !== originModule.image &&
      this.title === originModule.title
    ) {
      // Mark the image to be deleted
      dataStore.imagesToDelete.push(originModule.image);
    }

    // Upload the images of the parts to firebase
    if (this.parts.length !== 0) {
      await Promise.all(
        this.parts.map((part, index) => {
          return part.uploadImagesToFirebase(originModule.parts[index]);
        }),
      );
    }
  }
}
