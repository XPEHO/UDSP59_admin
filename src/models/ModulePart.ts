import { ModulePartElement } from './ModulePartElement';

export class ModulePart {
  image: string;
  subtitle: string;
  elements: Array<ModulePartElement>;
  [key: string]: any;

  constructor(image: string, subtitle: string, elements: Array<ModulePartElement>) {
    this.image = image;
    this.subtitle = subtitle;
    this.elements = elements;
  }

  toJsonObject() {
    return {
      image: this.image,
      subtitle: this.subtitle,
      elements: this.elements.map((element) => element.toJsonObject())
    }
  }

  equals(part: ModulePart) {
    return this.image === part.image
      && this.subtitle === part.subtitle
      && this.elements.length === part.elements.length
      && this.elements.every((element, index) => element.equals(part.elements[index]));
  }

  clone() {
    return new ModulePart(
      this.image,
      this.subtitle,
      this.elements.map((element) => element.clone()));
  }
}