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

export const getUserListButtonText = (
    totalNumberUsers: number,
    labelUserSingular: string,
    labelUserPlural: string,
): string => {
    if (totalNumberUsers === 1) {
        return `1 ${labelUserSingular}`;
    } else if (totalNumberUsers <= 3) {
        return `${totalNumberUsers} ${labelUserPlural}`;
    } else {
        return `3+ ${labelUserPlural}`;
    }
};

export const getTotalNumberOfPages = (totalNumberOfItems: number, pageSize: number): number => {
    return Math.ceil(totalNumberOfItems / pageSize + 1) - 1;
};

export const getIdxStart = (pageSize: number, pageIdx: number): number => {
    return pageSize * (pageIdx - 1);
};

export const getIdxEnd = (pageSize: number, pageIdx: number): number => {
    return pageSize * pageIdx;
};
