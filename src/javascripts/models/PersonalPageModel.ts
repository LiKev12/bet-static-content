export default class PersonalPageModel {
    id: string = '';
    username: string = '';
    name: string = '';
    imageLink: string | null = null;
    numberOfPointsTaskCompleteToday: number = 0;
    timeZone: string = '';
    isSelectedTimeZone: boolean = true;
    isReachedNumberOfTasksLimit: boolean = false;

    constructor(personalPageModel: any) {
        if (personalPageModel === null) {
            return;
        }
        this.id = personalPageModel.id;
        this.username = personalPageModel.username;
        this.name = personalPageModel.name;
        this.imageLink = personalPageModel.imageLink;
        this.numberOfPointsTaskCompleteToday = personalPageModel.numberOfPointsTaskCompleteToday;
        this.timeZone = personalPageModel.timeZone;
        this.isSelectedTimeZone = personalPageModel.isSelectedTimeZone;
        this.isReachedNumberOfTasksLimit = personalPageModel.isReachedNumberOfTasksLimit;
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

    getTimeZone(): string {
        return this.timeZone;
    }

    getIsSelectedTimeZone(): boolean {
        return this.isSelectedTimeZone;
    }

    getIsReachedNumberOfTasksLimit(): boolean {
        return this.isReachedNumberOfTasksLimit;
    }
}
