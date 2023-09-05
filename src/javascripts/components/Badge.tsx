import type { ITaskCardProps } from './TaskCard';

export interface IBadgeProps {
    id: string;
    dateCreated: string;
    createdByUserId: string;

    tasks: ITaskCardProps;
    name: string;
    description: string;
    imagePath: string;

    isComplete: boolean;
    completedByUserIds: string[];
    dateCompleted: string;
}

export {};
