import { ModulePart } from './ModulePart';

export class Module {
    icon: string;
    image: string;
    title: string;
    parts: Array<ModulePart>;

    constructor(icon: string, image: string, title: string, parts: Array<ModulePart>) {
        this.icon = icon;
        this.image = image;
        this.title = title;
        this.parts = parts;
    }
}