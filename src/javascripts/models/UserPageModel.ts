import UserBubbleModel from 'src/javascripts/models/UserBubbleModel';
export default class UserPageModel {
    id: string = '';
    username: string = '';
    name: string = '';
    bio: string | null = null;
    imageLink: string | null = null;
    userBubblesFollowing: UserBubbleModel[] = [];
    userBubblesFollowingTotalNumber: number = 0;
    userBubblesFollower: UserBubbleModel[] = [];
    userBubblesFollowerTotalNumber: number = 0;
    isMe: boolean = false;
    isFollowedByMe: boolean = false;
    isFollowRequestSentNotYetAccepted: boolean = false;
    numberOfPendingFollowUserRequests: number = 0;
    constructor(userPageModel: any) {
        if (userPageModel === null) {
            return;
        }
        this.id = userPageModel.id;
        this.username = userPageModel.username;
        this.name = userPageModel.name;
        this.bio = userPageModel.bio;
        this.imageLink = userPageModel.imageLink;
        this.userBubblesFollowing = userPageModel.userBubblesFollowing.map(
            (userBubbleFollowing: any) => new UserBubbleModel(userBubbleFollowing),
        );
        this.userBubblesFollowingTotalNumber = userPageModel.userBubblesFollowingTotalNumber;
        this.userBubblesFollower = userPageModel.userBubblesFollower.map(
            (userBubbleFollower: any) => new UserBubbleModel(userBubbleFollower),
        );
        this.userBubblesFollowerTotalNumber = userPageModel.userBubblesFollowerTotalNumber;
        this.isMe = userPageModel.isMe;
        this.isFollowedByMe = userPageModel.isFollowedByMe;
        this.isFollowRequestSentNotYetAccepted = userPageModel.isFollowRequestSentNotYetAccepted;
        this.numberOfPendingFollowUserRequests = userPageModel.numberOfPendingFollowUserRequests;
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

    getBio(): string | null {
        return this.bio;
    }

    getImageLink(): string | null {
        return this.imageLink;
    }

    getUserBubblesFollowing(): UserBubbleModel[] {
        return this.userBubblesFollowing;
    }

    getUserBubblesFollowingTotalNumber(): number {
        return this.userBubblesFollowingTotalNumber;
    }

    getUserBubblesFollower(): UserBubbleModel[] {
        return this.userBubblesFollower;
    }

    getUserBubblesFollowerTotalNumber(): number {
        return this.userBubblesFollowerTotalNumber;
    }

    getIsMe(): boolean {
        return this.isMe;
    }

    getIsFollowedByMe(): boolean {
        return this.isFollowedByMe;
    }

    getIsFollowRequestSentNotYetAccepted(): boolean {
        return this.isFollowRequestSentNotYetAccepted;
    }

    getNumberOfPendingFollowUserRequests(): number {
        return this.numberOfPendingFollowUserRequests;
    }
}
