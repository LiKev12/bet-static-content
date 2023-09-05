export interface IPodProps {
    id: string;
    dateCreated: string;
    createdByUserId: string;

    name: string;
    description: string;
    imagePath: string;

    isActive: boolean;
    // moderatorUserIds: string[];
    numberOfUsers: number;
}

export {};
