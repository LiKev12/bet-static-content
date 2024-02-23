import ReactionsModel from 'src/javascripts/models/ReactionsModel';
export default class TaskCommentReplyModel {
    idTaskCommentReply: string = '';
    idUser: string = '';
    username: string = '';
    userImageLink: string = '';
    timestampToSortBy: number = 0;
    datetimeDateAndTimeLabel: string = '';
    isText: boolean = false;
    commentReplyText: string = '';
    isImage: boolean = false;
    commentReplyImageLink: string = '';
    reactions: ReactionsModel = new ReactionsModel(null);

    constructor(taskCommentReplyModel: any) {
        if (taskCommentReplyModel === null) {
            return;
        }
        this.idTaskCommentReply = taskCommentReplyModel.idTaskCommentReply;
        this.idUser = taskCommentReplyModel.idUser;
        this.username = taskCommentReplyModel.username;
        this.userImageLink = taskCommentReplyModel.userImageLink;
        this.timestampToSortBy = taskCommentReplyModel.timestampToSortBy;
        this.datetimeDateAndTimeLabel = taskCommentReplyModel.datetimeDateAndTimeLabel;
        this.isText = taskCommentReplyModel.isText;
        this.commentReplyText = taskCommentReplyModel.commentReplyText;
        this.isImage = taskCommentReplyModel.isImage;
        this.commentReplyImageLink = taskCommentReplyModel.commentReplyImageLink;
        this.reactions = taskCommentReplyModel.reactions = new ReactionsModel(taskCommentReplyModel.reactions);
    }

    getIdTaskCommentReply(): string {
        return this.idTaskCommentReply;
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

    getCommentReplyText(): string {
        return this.commentReplyText;
    }

    getIsImage(): boolean {
        return this.isImage;
    }

    getCommentReplyImageLink(): string {
        return this.commentReplyImageLink;
    }

    getReactions(): ReactionsModel {
        return this.reactions;
    }
}
