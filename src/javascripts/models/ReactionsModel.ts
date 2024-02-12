import UserBubbleReactionModel from 'src/javascripts/models/UserBubbleReactionModel';

export default class ReactionsModel {
    idReactionTargetEntity: string = '';
    userBubblesReaction: UserBubbleReactionModel[] = [];
    userBubblesReactionTotalNumber: number = 0;
    myReactionType: string | null = null;

    constructor(reactionsModel: any, isInitial: boolean = false) {
        if (isInitial) {
            return;
        }
        this.idReactionTargetEntity = reactionsModel.idReactionTargetEntity;
        this.userBubblesReaction = reactionsModel.userBubblesReaction.map(
            (userBubbleReactionTask: any) => new UserBubbleReactionModel(userBubbleReactionTask),
        );
        this.userBubblesReactionTotalNumber = reactionsModel.userBubblesReactionTotalNumber;
        this.myReactionType = reactionsModel.myReactionType;
    }

    getIdReactionTargetEntity(): string {
        return this.idReactionTargetEntity;
    }

    getUserBubblesReaction(): UserBubbleReactionModel[] {
        return this.userBubblesReaction;
    }

    getUserBubblesReactionTotalNumber(): number {
        return this.userBubblesReactionTotalNumber;
    }

    getMyReactionType(): string | null {
        return this.myReactionType;
    }
}
