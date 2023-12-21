export class Account {
    mail: string;
    admin: boolean;

    constructor(mail: string, admin: boolean) {
        this.mail = mail;
        this.admin = admin;
    }
}