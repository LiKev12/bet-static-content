export default class AccountSettingsPageModel {
    id: string = '';
    username: string = '';
    email: string = '';
    imageLink: string = '';
    timeZone: string = '';

    constructor(accountSettingsPageModel: any) {
        if (accountSettingsPageModel === null) {
            return;
        }
        this.id = accountSettingsPageModel.id;
        this.username = accountSettingsPageModel.username;
        this.email = accountSettingsPageModel.email;
        this.imageLink = accountSettingsPageModel.imageLink;
        this.timeZone = accountSettingsPageModel.timeZone;
    }

    getId(): string {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getImageLink(): string {
        return this.imageLink;
    }

    getTimeZone(): string {
        return this.timeZone;
    }
}
