import UserBubbleModel from 'src/javascripts/models/UserBubbleModel';
export default class StampPageModel {
    id: string = '';
    isCreatedByMe: boolean = false;
    idUserCreate: string = '';
    usernameUserCreate: string = '';
    name: string = '';
    description: string | null = '';
    imageLink: string | null = null;
    userBubblesStampCollect: UserBubbleModel[] = [];
    userBubblesStampCollectTotalNumber: number = 0;
    isCollectedByMe: boolean = false;
    isEligibleToBeCollectedByMe: boolean = false;

    constructor(stampPageModel: any, isInitial: boolean = false) {
        if (isInitial) {
            return;
        }
        this.id = stampPageModel.id;
        this.isCreatedByMe = stampPageModel.isCreatedByMe;
        this.idUserCreate = stampPageModel.idUserCreate;
        this.usernameUserCreate = stampPageModel.usernameUserCreate;
        this.name = stampPageModel.name;
        this.description = stampPageModel.description;
        this.imageLink = stampPageModel.imageLink;
        this.userBubblesStampCollect = stampPageModel.userBubblesStampCollect.map(
            (userBubbleStampCollect: any) => new UserBubbleModel(userBubbleStampCollect),
        );
        this.userBubblesStampCollectTotalNumber = stampPageModel.userBubblesStampCollectTotalNumber;
        this.isCollectedByMe = stampPageModel.isCollectedByMe;
        this.isEligibleToBeCollectedByMe = stampPageModel.isEligibleToBeCollectedByMe;
    }

    getId(): string {
        return this.id;
    }

    getIsCreatedByMe(): boolean {
        return this.isCreatedByMe;
    }

    getIdUserCreate(): string {
        return this.idUserCreate;
    }

    getUsernameUserCreate(): string {
        return this.usernameUserCreate;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string | null {
        return this.description;
    }

    getImageLink(): string | null {
        return this.imageLink;
    }

    getUserBubblesStampCollect(): UserBubbleModel[] {
        return this.userBubblesStampCollect;
    }

    getUserBubblesStampCollectTotalNumber(): number {
        return this.userBubblesStampCollectTotalNumber;
    }

    getIsCollectedByMe(): boolean {
        return this.isCollectedByMe;
    }

    getIsEligibleToBeCollectedByMe(): boolean {
        return this.isEligibleToBeCollectedByMe;
    }
}
