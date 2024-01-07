export default class PodCardModel {
    id: string;
    name: string;
    description: string | null;
    imageLink: string | null;
    isPublic: boolean;
    numberOfMembers: number;
    isMember: boolean;
    isModerator: boolean;

    constructor(podCardModel: any) {
        this.id = podCardModel.id;
        this.name = podCardModel.name;
        this.description = podCardModel.description;
        this.imageLink = podCardModel.imageLink;
        this.numberOfMembers = podCardModel.numberOfMembers;
        this.isPublic = podCardModel.isPublic;
        this.isMember = podCardModel.isMember;
        this.isModerator = podCardModel.isModerator;
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

    getNumberOfMembers(): number {
        return this.numberOfMembers;
    }

    getIsPublic(): boolean {
        return this.isPublic;
    }

    getIsMember(): boolean {
        return this.isMember;
    }

    getIsModerator(): boolean {
        return this.isModerator;
    }
}
