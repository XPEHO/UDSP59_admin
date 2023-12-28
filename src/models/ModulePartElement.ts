export class ModulePartElement {
    image: string;
    text: string;
    [key: string]: any;

    constructor(image: string, text: string) {
        this.image = image;
        this.text = text;
    }

    toJsonObject() {
        return {
            image: this.image,
            text: this.text
        }
    }
}