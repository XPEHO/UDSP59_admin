import { ModulePartElement } from './ModulePartElement';

export class ModulePart {
    image: string;
    order: number;
    subtitle: string;
    elements: Array<ModulePartElement>;

    constructor(image: string, order: number, subtitle: string, elements: Array<ModulePartElement>) {
        this.image = image;
        this.order = order;
        this.subtitle = subtitle;
        this.elements = elements;
    }
}