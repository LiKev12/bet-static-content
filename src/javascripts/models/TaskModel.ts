import UserBubbleModel from 'src/javascripts/models/UserBubbleModel';

export default class TaskModel {
    id: string = '';
    name: string = '';
    description: string | null = null;
    imageLink: string | null = null;
    numberOfPoints: number = 0;
    idPod: string | null = null;
    noteText: string | null = null;
    noteImageLink: string | null = null;
    isComplete: boolean = false;
    isStar: boolean = false;
    isPin: boolean = false;
    datetimeCreate: string = '';
    datetimeUpdate: string | null = null;
    datetimeTarget: string | null = null;
    datetimeComplete: string | null = null;
    userBubblesTaskComplete: UserBubbleModel[] | null = null;
    userBubblesTaskCompleteTotalNumber: number = 0;
    isMemberOfTaskPod: boolean = false;

    constructor(taskModel: any, isInitial: boolean = false) {
        if (isInitial) {
            return;
        }
        this.id = taskModel.id;
        this.name = taskModel.name;
        this.description = taskModel.description;
        this.imageLink = taskModel.imageLink;
        this.numberOfPoints = taskModel.numberOfPoints;
        this.idPod = taskModel.idPod;
        this.isComplete = taskModel.isComplete;
        this.noteText = taskModel.noteText;
        this.noteImageLink = taskModel.noteImageLink;
        this.isStar = taskModel.isStar;
        this.isPin = taskModel.isPin;
        this.datetimeCreate = taskModel.datetimeCreate;
        this.datetimeUpdate = taskModel.datetimeUpdate;
        this.datetimeTarget = taskModel.datetimeTarget;
        this.datetimeComplete = taskModel.datetimeComplete;
        this.userBubblesTaskComplete =
            taskModel.userBubblesTaskComplete === null
                ? null
                : taskModel.userBubblesTaskComplete.map(
                      (userBubbleTaskComplete: any) => new UserBubbleModel(userBubbleTaskComplete),
                  );
        this.userBubblesTaskCompleteTotalNumber = taskModel.userBubblesTaskCompleteTotalNumber;
        this.isMemberOfTaskPod = taskModel.isMemberOfTaskPod;
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

    getNumberOfPoints(): number {
        return this.numberOfPoints;
    }

    getIdPod(): string | null {
        return this.idPod;
    }

    getNoteText(): string | null {
        return this.noteText;
    }

    getNoteImageLink(): string | null {
        return this.noteImageLink;
    }

    getIsComplete(): boolean {
        return this.isComplete;
    }

    getIsStar(): boolean {
        return this.isStar;
    }

    getIsPin(): boolean {
        return this.isPin;
    }

    getDatetimeCreate(): string {
        return this.datetimeCreate;
    }

    getDatetimeUpdate(): string | null {
        return this.datetimeUpdate;
    }

    getDatetimeTarget(): string | null {
        return this.datetimeTarget;
    }

    getDatetimeComplete(): string | null {
        return this.datetimeComplete;
    }

    getUserBubblesTaskComplete(): UserBubbleModel[] | null {
        return this.userBubblesTaskComplete;
    }

    getUserBubblesTaskCompleteTotalNumber(): number {
        return this.userBubblesTaskCompleteTotalNumber;
    }

    getIsMemberOfTaskPod(): boolean {
        return this.isMemberOfTaskPod;
    }
}
