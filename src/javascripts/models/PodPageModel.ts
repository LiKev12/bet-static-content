export default class PodPageModel {
    id: string;
    name: string;
    description: string | null;
    imageLink: string | null;
    // TODO: add more properties depending on what data the page needs to display on the UI

    constructor(podPageModel: any) {
        this.id = podPageModel.id;
        this.name = podPageModel.name;
        this.description = podPageModel.description;
        this.imageLink = podPageModel.imageLink;
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
}
