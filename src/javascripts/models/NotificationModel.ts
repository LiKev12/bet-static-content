export default class NotificationModel {
    id: string = '';
    idUser: string = '';
    notificationType: string = '';
    notificationMessage: string = '';
    linkPageType: string = '';
    idLinkPage: string = '';
    isSeen: boolean = false;
    timestampToSortBy: number = 0;
    datetimeDateAndTimeLabel: string = '';
    imageLink: string | null = null;
    isDismissed: boolean = false;
    isMemberOfPod: boolean = false;
    isFollowedByUserWhoSentFollowRequest: boolean = false;

    constructor(notificationModel: any, isInitial: boolean = false) {
        if (isInitial) {
            return;
        }
        this.id = notificationModel.id;
        this.idUser = notificationModel.idUser;
        this.notificationType = notificationModel.notificationType;
        this.notificationMessage = notificationModel.notificationMessage;
        this.linkPageType = notificationModel.linkPageType;
        this.idLinkPage = notificationModel.idLinkPage;
        this.isSeen = notificationModel.isSeen;
        this.timestampToSortBy = notificationModel.timestampToSortBy;
        this.datetimeDateAndTimeLabel = notificationModel.datetimeDateAndTimeLabel;
        this.imageLink = notificationModel.imageLink;
        this.isDismissed = notificationModel.isDismissed;
        this.isMemberOfPod = notificationModel.isMemberOfPod;
        this.isFollowedByUserWhoSentFollowRequest = notificationModel.isFollowedByUserWhoSentFollowRequest;
    }

    getId(): string {
        return this.id;
    }

    getIdUser(): string {
        return this.idUser;
    }

    getNotificationType(): string {
        return this.notificationType;
    }

    getNotificationMessage(): string {
        return this.notificationMessage;
    }

    getLinkPageType(): string {
        return this.linkPageType;
    }

    getIdLinkPage(): string {
        return this.idLinkPage;
    }

    getIsSeen(): boolean {
        return this.isSeen;
    }

    getTimestampToSortBy(): number {
        return this.timestampToSortBy;
    }

    getDatetimeDateAndTimeLabel(): string {
        return this.datetimeDateAndTimeLabel;
    }

    getImageLink(): string | null {
        return this.imageLink;
    }

    getIsDismissed(): boolean {
        return this.isDismissed;
    }

    getIsMemberOfPod(): boolean {
        return this.isMemberOfPod;
    }

    getIsFollowedByUserWhoSentFollowRequest(): boolean {
        return this.isFollowedByUserWhoSentFollowRequest;
    }
}
