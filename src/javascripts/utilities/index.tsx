import type { ITaskCardProps } from 'src/javascripts/components/TaskCard';
import type { IStampCardProps } from 'src/javascripts/components/StampCard';
import type { IPodCardProps } from 'src/javascripts/components/PodCard';

export const getFilteredTasks = (
    tasks: ITaskCardProps[],
    text: string,
    filterTaskState: {
        isUseFilterComplete: boolean;
        isComplete: boolean;
        isNotComplete: boolean;
        isUseFilterStar: boolean;
        isStar: boolean;
        isNotStar: boolean;
        isUseFilterPin: boolean;
        isPin: boolean;
        isNotPin: boolean;
    },
): ITaskCardProps[] => {
    const {
        isUseFilterComplete,
        isComplete,
        isNotComplete,
        isUseFilterStar,
        isStar,
        isNotStar,
        isUseFilterPin,
        isPin,
        isNotPin,
    } = filterTaskState;
    const isMatchName = (task: ITaskCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = task.name.toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchDescription = (task: ITaskCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = (task.description !== null ? task.description : '').toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchComplete = (
        task: ITaskCardProps,
        isUseFilterComplete: boolean,
        isComplete: boolean,
        isNotComplete: boolean,
    ): boolean => {
        if (!isUseFilterComplete) return true;
        if (!isComplete && !isNotComplete) return false;
        const isMatch = task.isComplete === isComplete || task.isComplete === !isNotComplete;
        return isMatch;
    };
    const isMatchStarred = (
        task: ITaskCardProps,
        isUseFilterStar: boolean,
        isStar: boolean,
        isNotStar: boolean,
    ): boolean => {
        if (!isUseFilterStar) return true;
        if (!isStar && !isNotStar) return false;
        const isMatch = task.isStar === isStar || task.isStar === !isNotStar;
        return isMatch;
    };
    const isMatchPinned = (
        task: ITaskCardProps,
        isUseFilterPin: boolean,
        isPin: boolean,
        isNotPin: boolean,
    ): boolean => {
        if (!isUseFilterPin) return true;
        if (!isPin && !isNotPin) return false;
        const isMatch = task.isPin === isPin || task.isPin === !isNotPin;
        return isMatch;
    };
    const filteredTasks = tasks.filter(
        (task) =>
            (isMatchName(task, text) || isMatchDescription(task, text)) &&
            isMatchComplete(task, isUseFilterComplete, isComplete, isNotComplete) &&
            isMatchStarred(task, isUseFilterStar, isStar, isNotStar) &&
            isMatchPinned(task, isUseFilterPin, isPin, isNotPin),
    );
    return filteredTasks;
};

export const getFilteredStamps = (
    stamps: IStampCardProps[],
    text: string,
    filterStampState: {
        isUseKeyStampCollected: boolean;
        isStampCollected: boolean;
        isStampNotCollected: boolean;
    },
): IStampCardProps[] => {
    const { isUseKeyStampCollected, isStampCollected, isStampNotCollected } = filterStampState;
    const isMatchName = (stamp: IStampCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = stamp.name.toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchDescription = (stamp: IStampCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = stamp.description.toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchCollect = (
        stamp: IStampCardProps,
        isUseKeyStampCollected: boolean,
        isStampCollected: boolean,
        isStampNotCollected: boolean,
    ): boolean => {
        if (!isUseKeyStampCollected) return true;
        if (!isStampCollected && !isStampNotCollected) return false;
        return stamp.isCollected === isStampCollected || stamp.isCollected === !isStampNotCollected;
    };
    const filteredStamps = stamps.filter(
        (stamp) =>
            (isMatchName(stamp, text) || isMatchDescription(stamp, text)) &&
            isMatchCollect(stamp, isUseKeyStampCollected, isStampCollected, isStampNotCollected),
    );
    return filteredStamps;
};

export const getFilteredPods = (
    pods: IPodCardProps[],
    text: string,
    filterPodState: {
        isUseKeyPodMember: boolean;
        isPodMember: boolean;
        isPodNotMember: boolean;
        isUseKeyPodModerator: boolean;
        isPodModerator: boolean;
        isPodNotModerator: boolean;
    },
): IPodCardProps[] => {
    const { isUseKeyPodMember, isPodMember, isPodNotMember, isUseKeyPodModerator, isPodModerator, isPodNotModerator } =
        filterPodState;
    const isMatchName = (pod: IPodCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = pod.name.toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchDescription = (pod: IPodCardProps, text: string): boolean => {
        if (text === '') return true;
        const isMatch = pod.description.toLowerCase().includes(text.toLowerCase());
        return isMatch;
    };
    const isMatchMember = (
        pod: IPodCardProps,
        isUseKeyPodMember: boolean,
        isPodMember: boolean,
        isPodNotMember: boolean,
    ): boolean => {
        if (!isUseKeyPodMember) return true;
        if (!isPodMember && !isPodNotMember) return false;
        return pod.isMember === isPodMember || pod.isMember === !isPodNotMember;
    };
    const isMatchModerator = (
        pod: IPodCardProps,
        isUseKeyPodModerator: boolean,
        isPodModerator: boolean,
        isPodNotModerator: boolean,
    ): boolean => {
        if (!isUseKeyPodModerator) return true;
        if (!isPodModerator && !isPodNotModerator) return false;
        return pod.isModerator === isPodModerator || pod.isModerator === !isPodNotModerator;
    };
    const filteredPods = pods.filter(
        (pod) =>
            (isMatchName(pod, text) || isMatchDescription(pod, text)) &&
            isMatchMember(pod, isUseKeyPodMember, isPodMember, isPodNotMember) &&
            isMatchModerator(pod, isUseKeyPodModerator, isPodModerator, isPodNotModerator),
    );
    return filteredPods;
};

export const getInputText = (rawInputText: string): string => {
    return rawInputText.trim();
};

export const getInputInteger = (rawInputText: string): number => {
    // if (rawInputText.trim().length === 0) {
    //     return 0;
    // }
    // const charPrefix = rawInputText.substring(0, 1).replace(/[^\d-]/g, '');
    // const charSuffix = rawInputText.substring(1).replace(/[^\d]/g, '');
    // const integerValue = Number(charPrefix.concat(charSuffix));
    // return integerValue;

    // from: https://stackoverflow.com/questions/58413362/how-to-remove-all-non-numeric-characters-excluding-minus-dot-and-comma-in-a-s
    return Number(rawInputText.replace(/^(-)|[^0-9]+/g, '$1'));
};

export const getHashFromString = (inputString: string): number => {
    let hash: number = 0;
    if (inputString.length === 0) return hash;
    for (let i = 0; i < inputString.length; i++) {
        const char = inputString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

export const getUserListTaskComplete = (taskId: any, users: any, junctionTableTaskUserCompletedByUser: any): any => {
    const userIdToUserMap = new Map();
    users.forEach((entry: any) => {
        userIdToUserMap.set(entry.id, entry);
    });
    const userList: any = [];
    junctionTableTaskUserCompletedByUser.forEach((entry: any) => {
        if (entry.id__task === taskId) {
            userList.push({
                ...userIdToUserMap.get(entry.id__user),
                date_completed: entry.date_completed,
            });
        }
    });
    userList.sort((userA: any, userB: any) => userA.date_completed - userB.date_completed);
    const userListTaskComplete = userList.map((user: any) => {
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            image: user.image_path,
        };
    });
    return userListTaskComplete;
};

export const getUserListPodMembers = (idPod: any, users: any, junctionTablePodUserPodHasUserMember: any): any => {
    const userIdToUserMap = new Map();
    users.forEach((entry: any) => {
        userIdToUserMap.set(entry.id, entry);
    });
    const userList: any = [];
    junctionTablePodUserPodHasUserMember.forEach((entry: any) => {
        if (entry.id__pod === idPod) {
            userList.push({
                ...userIdToUserMap.get(entry.id__user),
                date_completed: entry.date_completed,
            });
        }
    });
    userList.sort((userA: any, userB: any) => userA.date_completed - userB.date_completed);
    const userListPodMembers = userList.map((user: any) => {
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            image: user.image_path,
        };
    });
    return userListPodMembers;
};

export const getUserListPodModerators = (idPod: any, users: any, junctionTablePodUserPodHasUserModerator: any): any => {
    const userIdToUserMap = new Map();
    users.forEach((entry: any) => {
        userIdToUserMap.set(entry.id, entry);
    });
    const userList: any = [];
    junctionTablePodUserPodHasUserModerator.forEach((entry: any) => {
        if (entry.id__pod === idPod) {
            userList.push({
                ...userIdToUserMap.get(entry.id__user),
                date_completed: entry.date_completed,
            });
        }
    });
    userList.sort((userA: any, userB: any) => userA.date_completed - userB.date_completed);
    const userListPodMembers = userList.map((user: any) => {
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            image: user.image_path,
        };
    });
    return userListPodMembers;
};

export const getUserListStampCollect = (
    stampId: any,
    users: any,
    junctionTableStampUserUserCollectedStamp: any,
): any => {
    const userIdToUserMap = new Map();
    users.forEach((entry: any) => {
        userIdToUserMap.set(entry.id, entry);
    });
    const userList: any = [];
    junctionTableStampUserUserCollectedStamp.forEach((entry: any) => {
        if (entry.id__stamp === stampId) {
            userList.push({
                ...userIdToUserMap.get(entry.id__user),
                date_completed: entry.date_completed,
            });
        }
    });
    userList.sort((userA: any, userB: any) => userA.date_completed - userB.date_completed);
    const userListStampCollect = userList.map((user: any) => {
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            image: user.image_path,
        };
    });
    return userListStampCollect;
};

export const getUserListUserFollowing = (userId: any, users: any, junctionTableUserUser1Following2: any): any => {
    const userIdToUserMap = new Map();
    users.forEach((entry: any) => {
        userIdToUserMap.set(entry.id, {
            id: entry.id,
            name: entry.name,
            username: entry.username,
            bio: entry.bio,
            image: entry.image_path,
        });
    });
    const userList: any = [];
    junctionTableUserUser1Following2.forEach((entry: any) => {
        if (entry.id__user1 === userId) {
            userList.push({
                ...userIdToUserMap.get(entry.id__user2),
                date: entry.date,
            });
        }
    });
    return userList.sort((userA: any, userB: any) => userA.date - userB.date);
};

export const getUserListUserFollower = (userId: any, users: any, junctionTableUserUser1Following2: any): any => {
    const userIdToUserMap = new Map();
    users.forEach((entry: any) => {
        userIdToUserMap.set(entry.id, {
            id: entry.id,
            name: entry.name,
            username: entry.username,
            bio: entry.bio,
            image: entry.image_path,
        });
    });
    const userList: any = [];
    junctionTableUserUser1Following2.forEach((entry: any) => {
        if (entry.id__user2 === userId) {
            userList.push({
                ...userIdToUserMap.get(entry.id__user1),
                date: entry.date,
            });
        }
    });
    return userList.sort((userA: any, userB: any) => userA.date - userB.date);
};

// export const handleToggleTaskComplete = (taskId: string, tasks: any, junctionTableTaskUserCompletedByUser: any) {
//     const taskIdToTaskMap = new Map();
//     tasks.forEach((entry: any) => {
//         taskIdToTaskMap.set(entry.id, entry);
//     });
//     tasks.forEach((task: any) => {
//         if (task.id === taskId) {

//         }
//     });
//     junctionTableTaskUserCompletedByUser.forEach((entry: any) => {
//         if (entry.id__task === taskId) {
//             taskIdToTaskMap.get(taskId) = {
//                 ...taskIdToTaskMap.get(taskId),
//             }
//         }
//     });
// }
// handleToggleStar;
// handleTogglePin;
