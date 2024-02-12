export default class Constants {
    extraVar: string = 'filler'; // to combat eslint "Unexpected class with only static properties"

    // general response
    static RESPONSE_STATE_UNSTARTED = 'RESPONSE_STATE_UNSTARTED';
    static RESPONSE_STATE_LOADING = 'RESPONSE_STATE_LOADING';
    static RESPONSE_STATE_ERROR = 'RESPONSE_STATE_ERROR';
    static RESPONSE_STATE_SUCCESS = 'RESPONSE_STATE_SUCCESS';
    static RESPONSE_DEFAULT_ERROR_MESSAGE =
        'We apologize for the inconvenience. We are working to fix this issue as soon as possible. Thank you.';

    static RESPONSE_ERROR_CODE_TO_ERROR_MESSAGE_MAP: Record<string, string> = {
        POD_DUPLICATE_NAME: 'Pod with same name already exists. Please choose another name.',
        STAMP_DUPLICATE_NAME: 'Stamp with same name already exists. Please choose another name.',
        USER_DUPLICATE_USERNAME: 'User with same username already exists. Please choose another username.',
    };

    static RESPONSE_GET_ERROR_MESSAGE = (errorCode: string | null): string => {
        if (errorCode === null || errorCode === undefined) {
            return Constants.RESPONSE_DEFAULT_ERROR_MESSAGE;
        }
        if (!Object.keys(Constants.RESPONSE_ERROR_CODE_TO_ERROR_MESSAGE_MAP).includes(errorCode)) {
            return Constants.RESPONSE_DEFAULT_ERROR_MESSAGE;
        }
        return Constants.RESPONSE_ERROR_CODE_TO_ERROR_MESSAGE_MAP[errorCode];
    };

    // TASK
    static TASK_NAME_MIN_LENGTH_CHARACTERS = 1;
    static TASK_NAME_MAX_LENGTH_CHARACTERS = 100;
    static TASK_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;
    static TASK_NOTE_TEXT_MIN_LENGTH_CHARACTERS = 1;
    static TASK_NOTE_TEXT_MAX_LENGTH_CHARACTERS = 1000;
    static TASK_NUMBER_OF_POINTS_MIN = -1000;
    static TASK_NUMBER_OF_POINTS_MAX = 1000;
    static TASK_COMMENT_TASK_REPLY_MAX_LENGTH_CHARACTERS = 200;
    static REACTION_TYPE_LIKE = 'LIKE';
    static REACTION_TYPE_LOVE = 'LOVE';
    static REACTION_TYPE_LAUGH = 'LAUGH';
    static REACTION_TYPE_WOW = 'WOW';
    static REACTION_TYPE_SAD = 'SAD';
    static REACTION_TYPE_ANGRY = 'ANGRY';
    static REACTION_TYPES = [
        Constants.REACTION_TYPE_LIKE,
        Constants.REACTION_TYPE_LOVE,
        Constants.REACTION_TYPE_LAUGH,
        Constants.REACTION_TYPE_WOW,
        Constants.REACTION_TYPE_SAD,
        Constants.REACTION_TYPE_ANGRY,
    ];

    static GET_EMOJI_HTML_FROM_REACTION = (reactionType: string): any => {
        if (reactionType === Constants.REACTION_TYPE_LIKE) {
            return String.fromCodePoint(parseInt('1F44D', 16));
        } else if (reactionType === Constants.REACTION_TYPE_LOVE) {
            return String.fromCodePoint(parseInt('2764', 16), parseInt('FE0F', 16));
        } else if (reactionType === Constants.REACTION_TYPE_LAUGH) {
            return String.fromCodePoint(parseInt('1F606', 16));
        } else if (reactionType === Constants.REACTION_TYPE_WOW) {
            return String.fromCodePoint(parseInt('1F62E', 16));
        } else if (reactionType === Constants.REACTION_TYPE_SAD) {
            return String.fromCodePoint(parseInt('1F622', 16));
        } else if (reactionType === Constants.REACTION_TYPE_ANGRY) {
            return String.fromCodePoint(parseInt('1F620', 16));
        }
        return null;
    };

    static TASK_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Task name must be between ${Constants.TASK_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.TASK_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static TASK_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Task description must be less than ${
            Constants.TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static TASK_INPUT_NOTE_TEXT_HELPER_TEXT = (numChars: number): string =>
        `Task note must be less than ${
            Constants.TASK_NOTE_TEXT_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static TASK_COMMENT_TEXT_HELPER_TEXT = (numChars: number): string =>
        `Select a comment to post a reply. Deselect comment to post a new comment. Comment must be less than ${
            Constants.TASK_COMMENT_TASK_REPLY_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static INPUT_NUMBER_OF_POINTS_HELPER_TEXT = `Task points must be between ${Constants.TASK_NUMBER_OF_POINTS_MIN} to ${Constants.TASK_NUMBER_OF_POINTS_MAX}, inclusive.`;

    // POD
    static POD_NAME_MIN_LENGTH_CHARACTERS = 3;
    static POD_NAME_MAX_LENGTH_CHARACTERS = 50;
    static POD_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static POD_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;

    static POD_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Pod name must be between ${Constants.POD_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.POD_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static POD_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Pod description must be less than ${
            Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    // STAMP
    static STAMP_NAME_MIN_LENGTH_CHARACTERS = 3;
    static STAMP_NAME_MAX_LENGTH_CHARACTERS = 50;
    static STAMP_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;

    static STAMP_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Stamp name must be between ${Constants.STAMP_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.STAMP_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static STAMP_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Stamp description must be less than ${
            Constants.STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    // USER
    static USER_USERNAME_MIN_LENGTH_CHARACTERS = 3;
    static USER_USERNAME_MAX_LENGTH_CHARACTERS = 30;
    static USER_NAME_MIN_LENGTH_CHARACTERS = 3;
    static USER_NAME_MAX_LENGTH_CHARACTERS = 50;
    static USER_BIO_MIN_LENGTH_CHARACTERS = 1;
    static USER_BIO_MAX_LENGTH_CHARACTERS = 1000;

    static USER_INPUT_USERNAME_HELPER_TEXT = (numChars: number): string =>
        `Username must be between ${Constants.USER_USERNAME_MIN_LENGTH_CHARACTERS}-${
            Constants.USER_USERNAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static USER_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Name must be between ${Constants.USER_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.USER_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static USER_INPUT_BIO_HELPER_TEXT = (numChars: number): string =>
        `User bio must be less than ${
            Constants.USER_BIO_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently).`;

    static NOTIFICATION_TYPE_SENT_YOU_JOIN_POD_INVITE = 'NOTIFICATION_TYPE_SENT_YOU_JOIN_POD_INVITE';
    static NOTIFICATION_TYPE_APPROVED_YOUR_BECOME_POD_MODERATOR_REQUEST =
        'NOTIFICATION_TYPE_APPROVED_YOUR_BECOME_POD_MODERATOR_REQUEST';

    static NOTIFICATION_TYPE_ADDED_YOU_AS_POD_MODERATOR = 'NOTIFICATION_TYPE_ADDED_YOU_AS_POD_MODERATOR';
    static NOTIFICATION_TYPE_SENT_YOU_FOLLOW_REQUEST = 'NOTIFICATION_TYPE_SENT_YOU_FOLLOW_REQUEST';
    static NOTIFICATION_TYPE_ACCEPTED_YOUR_FOLLOW_REQUEST = 'NOTIFICATION_TYPE_ACCEPTED_YOUR_FOLLOW_REQUEST';
    static NOTIFICATION_LINK_PAGE_TYPE_POD = 'POD';
    static NOTIFICATION_LINK_PAGE_TYPE_USER = 'USER';
    static NOTIFICATION_LINK_PAGE_TYPE_STAMP = 'STAMP';
}
