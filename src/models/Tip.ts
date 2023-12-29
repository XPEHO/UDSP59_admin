export class Tip {
    content: string;

    constructor(content: string) {
        this.content = content;
    }

    toJsonObject() {
        return {
            content: this.content,
        }
    }
}