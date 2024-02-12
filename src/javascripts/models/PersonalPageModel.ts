export default class PersonalPageModel {
    id: string;
    username: string;
    name: string;
    imageLink: string | null;
    numberOfPointsTaskCompleteToday: number;

    constructor(personalPageModel: any) {
        if (personalPageModel === null) {
            this.id = '';
            this.username = '';
            this.name = '';
            this.imageLink = null;
            this.numberOfPointsTaskCompleteToday = 0;
        } else {
            this.id = personalPageModel.id;
            this.username = personalPageModel.username;
            this.name = personalPageModel.name;
            this.imageLink = personalPageModel.imageLink;
            this.numberOfPointsTaskCompleteToday = personalPageModel.numberOfPointsTaskCompleteToday;
        }
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getUsername(): string {
        return this.username;
    }

    getImageLink(): string | null {
        return this.imageLink;
    }

    getNumberOfPointsTaskCompleteToday(): number {
        return this.numberOfPointsTaskCompleteToday;
    }
}
