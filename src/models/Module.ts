import { ModulePart } from './ModulePart';

export class Module {
    icon: string;
    image: string;
    title: string;
    parts: Array<ModulePart>;
    [key: string]: any;

    constructor(icon: string, image: string, title: string, parts: Array<ModulePart>) {
        this.icon = icon;
        this.image = image;
        this.title = title;
        this.parts = parts;
    }

    toJsonObject() {
        return {
            icon: this.icon,
            image: this.image,
            title: this.title,
            parts: this.parts.map((part) => part.toJsonObject())
        }
    }
}