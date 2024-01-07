export const MIN_LEN_CHARS_USERNAME = 3;
export const MAX_LEN_CHARS_USERNAME = 10;

export const MIN_LEN_CHARS_POD_NAME = 3;
export const MAX_LEN_CHARS_POD_NAME = 50;
export const MAX_LEN_CHARS_POD_DESCRIPTION = 1000;
export const POD_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
    `Pod name must be between ${MIN_LEN_CHARS_POD_NAME}-${MAX_LEN_CHARS_POD_DESCRIPTION} chars, inclusive (${numChars.toString()} chars currently)`;
export const POD_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
    `Pod description must be less than ${MAX_LEN_CHARS_POD_DESCRIPTION} chars, inclusive (${numChars.toString()} chars currently)`;

export const MIN_LEN_CHARS_STAMP_NAME = 3;
export const MAX_LEN_CHARS_STAMP_NAME = 50;
export const MAX_LEN_CHARS_STAMP_DESCRIPTION = 1000;
export const STAMP_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
    `Stamp name must be between ${MIN_LEN_CHARS_STAMP_NAME}-${MAX_LEN_CHARS_STAMP_DESCRIPTION} chars, inclusive (${numChars.toString()} chars currently)`;
export const STAMP_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
    `Stamp description must be less than ${MAX_LEN_CHARS_STAMP_DESCRIPTION} chars, inclusive (${numChars.toString()} chars currently)`;

export default class Constants {
    extraVar: string = 'filler'; // to combat eslint "Unexpected class with only static properties"

    // TASK
    static TASK_NAME_MIN_LENGTH_CHARACTERS = 1;
    static TASK_NAME_MAX_LENGTH_CHARACTERS = 100;
    static TASK_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;
    static TASK_NUMBER_OF_POINTS_MIN = -1000;
    static TASK_NUMBER_OF_POINTS_MAX = 1000;

    static TASK_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Task name must be between ${Constants.TASK_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.TASK_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently)`;

    static TASK_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Task description must be less than ${
            Constants.TASK_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently)`;

    static INPUT_NUMBER_OF_POINTS_HELPER_TEXT = `Task points must be between ${Constants.TASK_NUMBER_OF_POINTS_MIN} to ${Constants.TASK_NUMBER_OF_POINTS_MAX}, inclusive`;

    // POD
    static POD_NAME_MIN_LENGTH_CHARACTERS = 3;
    static POD_NAME_MAX_LENGTH_CHARACTERS = 50;
    static POD_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static POD_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;

    static POD_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Pod name must be between ${Constants.POD_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.POD_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently)`;

    static POD_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Pod description must be less than ${
            Constants.POD_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently)`;

    // STAMP
    static STAMP_NAME_MIN_LENGTH_CHARACTERS = 3;
    static STAMP_NAME_MAX_LENGTH_CHARACTERS = 50;
    static STAMP_DESCRIPTION_MIN_LENGTH_CHARACTERS = 1;
    static STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS = 1000;

    static STAMP_INPUT_NAME_HELPER_TEXT = (numChars: number): string =>
        `Stamp name must be between ${Constants.STAMP_NAME_MIN_LENGTH_CHARACTERS}-${
            Constants.STAMP_NAME_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently)`;

    static STAMP_INPUT_DESCRIPTION_HELPER_TEXT = (numChars: number): string =>
        `Stamp description must be less than ${
            Constants.STAMP_DESCRIPTION_MAX_LENGTH_CHARACTERS
        } chars, inclusive (${numChars.toString()} chars currently)`;

    // USER
    static USER_USERNAME_MIN_LENGTH_CHARACATERS = 3;
    static USER_USERNAME_MAX_LENGTH_CHARACATERS = 10;
}
