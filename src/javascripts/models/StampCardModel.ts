export default class StampCardModel {
    id: string;
    name: string;
    description: string;
    imageLink: string | null;
    numberOfUsersCollect: number;
    isPublic: boolean;
    isCollect: boolean;

    constructor(stampCardModel: any) {
        this.id = stampCardModel.id;
        this.name = stampCardModel.name;
        this.description = stampCardModel.description;
        this.imageLink = stampCardModel.imageLink;
        this.numberOfUsersCollect = stampCardModel.numberOfUsersCollect;
        this.isPublic = stampCardModel.isPublic;
        this.isCollect = stampCardModel.isCollect;
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

    getNumberOfUsersCollect(): number {
        return this.numberOfUsersCollect;
    }

    getIsPublic(): boolean {
        return this.isPublic;
    }

    getIsCollect(): boolean {
        return this.isCollect;
    }
}
