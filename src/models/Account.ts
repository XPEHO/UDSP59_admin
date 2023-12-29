export class Account {
    mail: string;
    admin: boolean;

    constructor(mail: string, admin: boolean) {
        this.mail = mail;
        this.admin = admin;
    }

    toJsonObject() {
        return {
            mail: this.mail,
            admin: this.admin,
        }
    }
}