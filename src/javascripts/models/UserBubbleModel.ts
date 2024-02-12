export default class UserBubbleModel {
    id: string;
    name: string;
    username: string;
    imageLink: string | null;
    timestampToSortBy: number;
    datetimeDateOnlyLabel: string;
    datetimeDateAndTimeLabel: string;
    isFollowedByMe: boolean;
    isMe: boolean;
    isFollowRequestSentNotYetAccepted: boolean;

    constructor(userBubbleModel: any) {
        this.id = userBubbleModel.id;
        this.name = userBubbleModel.name;
        this.username = userBubbleModel.username;
        this.imageLink = userBubbleModel.imageLink;
        this.timestampToSortBy = userBubbleModel.timestampToSortBy;
        this.datetimeDateOnlyLabel = userBubbleModel.datetimeDateOnlyLabel;
        this.datetimeDateAndTimeLabel = userBubbleModel.datetimeDateAndTimeLabel;
        this.isFollowedByMe = userBubbleModel.isFollowedByMe;
        this.isMe = userBubbleModel.isMe;
        this.isFollowRequestSentNotYetAccepted = userBubbleModel.isFollowRequestSentNotYetAccepted;
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

    getTimestampToSortBy(): number {
        return this.timestampToSortBy;
    }

    getDatetimeDateOnlyLabel(): string {
        return this.datetimeDateOnlyLabel;
    }

    getDatetimeDateAndTimeLabel(): string {
        return this.datetimeDateAndTimeLabel;
    }

    getIsFollowedByMe(): boolean {
        return this.isFollowedByMe;
    }

    getIsMe(): boolean {
        return this.isMe;
    }

    getIsFollowRequestSentNotYetAccepted(): boolean {
        return this.isFollowRequestSentNotYetAccepted;
    }
}
