import Constants from 'src/javascripts/Constants';

export default class ResponseModel {
    state: string = '';
    errorMessage: string | null = null;

    constructor(responseModel: any) {
        this.state = responseModel.state;
        this.errorMessage = responseModel.errorMessage;
    }

    getState(): string {
        return this.state;
    }

    getErrorMessage(): string | null {
        return this.errorMessage;
    }

    getIsSuccess(): boolean {
        return this.state === Constants.RESPONSE_STATE_SUCCESS;
    }

    getIsLoading(): boolean {
        return this.state === Constants.RESPONSE_STATE_LOADING;
    }

    getIsError(): boolean {
        return this.state === Constants.RESPONSE_STATE_ERROR;
    }

    getIsUnstarted(): boolean {
        return this.state === Constants.RESPONSE_STATE_UNSTARTED;
    }
}
