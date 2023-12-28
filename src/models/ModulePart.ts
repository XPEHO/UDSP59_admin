import { ModulePartElement } from './ModulePartElement';

export class ModulePart {
    image: string;
    order: number;
    subtitle: string;
    elements: Array<ModulePartElement>;
    [key: string]: any;

    constructor(image: string, order: number, subtitle: string, elements: Array<ModulePartElement>) {
        this.image = image;
        this.order = order;
        this.subtitle = subtitle;
        this.elements = elements;
    }

    toJsonObject() {
        return {
            image: this.image,
            order: this.order,
            subtitle: this.subtitle,
            elements: this.elements.map((element) => element.toJsonObject())
        }
    }
}