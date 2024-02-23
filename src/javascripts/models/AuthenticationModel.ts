export default class AuthenticationModel {
    jwtToken: string = '';

    constructor(authenticationModel: any) {
        if (authenticationModel === null) {
            return;
        }
        this.jwtToken = authenticationModel.jwtToken;
    }

    getJwtToken(): string {
        return this.jwtToken;
    }

    hasJwtToken(): boolean {
        return this.jwtToken !== '' && this.jwtToken !== null;
    }
}
