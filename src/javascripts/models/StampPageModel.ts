export default class StampPageModel {
    id: string;
    name: string;
    description: string | null;
    imageLink: string | null;
    // TODO: add more properties depending on what data the page needs to display on the UI

    constructor(stampPageModel: any) {
        this.id = stampPageModel.id;
        this.name = stampPageModel.name;
        this.description = stampPageModel.description;
        this.imageLink = stampPageModel.imageLink;
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
