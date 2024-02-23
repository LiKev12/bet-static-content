import UserBubbleModel from 'src/javascripts/models/UserBubbleModel';
export default class PodPageModel {
    id: string = '';
    name: string = '';
    description: string | null = null;
    imageLink: string | null = null;
    isPodMember: boolean = false;
    isPodModerator: boolean = false;
    isSentBecomePodModeratorRequest: boolean = false;
    numberOfPendingBecomeModeratorRequests: number = 0;
    userBubblesPodMember: UserBubbleModel[] = [];
    userBubblesPodMemberTotalNumber: number = 0;
    userBubblesPodModerator: UserBubbleModel[] = [];
    userBubblesPodModeratorTotalNumber: number = 0;

    constructor(podPageModel: any) {
        if (podPageModel === null) {
            return;
        }
        this.id = podPageModel.id;
        this.name = podPageModel.name;
        this.description = podPageModel.description;
        this.imageLink = podPageModel.imageLink;
        this.isPodMember = podPageModel.isPodMember;
        this.isPodModerator = podPageModel.isPodModerator;
        this.isSentBecomePodModeratorRequest = podPageModel.isSentBecomePodModeratorRequest;
        this.numberOfPendingBecomeModeratorRequests = podPageModel.numberOfPendingBecomeModeratorRequests;
        this.userBubblesPodMember = podPageModel.userBubblesPodMember.map(
            (userBubblePodMember: any) => new UserBubbleModel(userBubblePodMember),
        );
        this.userBubblesPodMemberTotalNumber = podPageModel.userBubblesPodMemberTotalNumber;
        this.userBubblesPodModerator = podPageModel.userBubblesPodModerator.map(
            (userBubblePodModerator: any) => new UserBubbleModel(userBubblePodModerator),
        );
        this.userBubblesPodModeratorTotalNumber = podPageModel.userBubblesPodModeratorTotalNumber;
    }

    getId(): string {
        return this.id;
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

    getIsPodMember(): boolean {
        return this.isPodMember;
    }

    getIsPodModerator(): boolean {
        return this.isPodModerator;
    }

    getIsSentBecomePodModeratorRequest(): boolean {
        return this.isSentBecomePodModeratorRequest;
    }

    getNumberOfPendingBecomeModeratorRequests(): number {
        return this.numberOfPendingBecomeModeratorRequests;
    }

    getUserBubblesPodMember(): UserBubbleModel[] {
        return this.userBubblesPodMember;
    }

    getUserBubblesPodMemberTotalNumber(): number {
        return this.userBubblesPodMemberTotalNumber;
    }

    getUserBubblesPodModerator(): UserBubbleModel[] {
        return this.userBubblesPodModerator;
    }

    getUserBubblesPodModeratorTotalNumber(): number {
        return this.userBubblesPodModeratorTotalNumber;
    }
}
