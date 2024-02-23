import ReactionsModel from 'src/javascripts/models/ReactionsModel';
export default class TaskCommentModel {
    idTaskComment: string = '';
    idUser: string = '';
    username: string = '';
    userImageLink: string = '';
    timestampToSortBy: number = 0;
    datetimeDateAndTimeLabel: string = '';
    isText: boolean = false;
    commentText: string = '';
    isImage: boolean = false;
    commentImageLink: string = '';
    numberOfReplies: number = 0;
    reactions: ReactionsModel = new ReactionsModel(null);

    constructor(taskCommentModel: any) {
        if (taskCommentModel === null) {
            return;
        }
        this.idTaskComment = taskCommentModel.idTaskComment;
        this.idUser = taskCommentModel.idUser;
        this.username = taskCommentModel.username;
        this.userImageLink = taskCommentModel.userImageLink;
        this.timestampToSortBy = taskCommentModel.timestampToSortBy;
        this.datetimeDateAndTimeLabel = taskCommentModel.datetimeDateAndTimeLabel;
        this.isText = taskCommentModel.isText;
        this.commentText = taskCommentModel.commentText;
        this.isImage = taskCommentModel.isImage;
        this.commentImageLink = taskCommentModel.commentImageLink;
        this.numberOfReplies = taskCommentModel.numberOfReplies;
        this.reactions = new ReactionsModel(taskCommentModel.reactions);
    }

    getIdTaskComment(): string {
        return this.idTaskComment;
    }

    getIdUser(): string {
        return this.idUser;
    }

    getUsername(): string {
        return this.username;
    }

    getUserImageLink(): string {
        return this.userImageLink;
    }

    getTimestampToSortBy(): number {
        return this.timestampToSortBy;
    }

    getDatetimeDateAndTimeLabel(): string {
        return this.datetimeDateAndTimeLabel;
    }

    getIsText(): boolean {
        return this.isText;
    }

    getCommentText(): string {
        return this.commentText;
    }

    getIsImage(): boolean {
        return this.isImage;
    }

    getCommentImageLink(): string {
        return this.commentImageLink;
    }

    getNumberOfReplies(): number {
        return this.numberOfReplies;
    }

    getReactions(): ReactionsModel {
        return this.reactions;
    }
}
