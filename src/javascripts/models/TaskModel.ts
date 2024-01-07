export default class TaskModel {
    id: string;
    name: string;
    description: string | null;
    imageLink: string | null;
    numberOfPoints: number;
    idPod: string | null;
    noteText: string | null;
    noteImage: string | null;
    isComplete: boolean;
    isStar: boolean;
    isPin: boolean;
    datetimeCreate: string;
    datetimeUpdate: string | null;
    datetimeTarget: string | null;
    datetimeComplete: string | null;

    constructor(taskModel: any) {
        this.id = taskModel.id;
        this.name = taskModel.name;
        this.description = taskModel.description;
        this.imageLink = taskModel.imageLink;
        this.numberOfPoints = taskModel.numberOfPoints;
        this.idPod = taskModel.idPod;
        this.isComplete = taskModel.isComplete;
        this.noteText = taskModel.noteText;
        this.noteImage = taskModel.noteImage;
        this.isStar = taskModel.isStar;
        this.isPin = taskModel.isPin;
        this.datetimeCreate = taskModel.datetimeCreate;
        this.datetimeUpdate = taskModel.datetimeUpdate;
        this.datetimeTarget = taskModel.datetimeTarget;
        this.datetimeComplete = taskModel.datetimeComplete;
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

    getNoteImage(): string | null {
        return this.noteImage;
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
}
