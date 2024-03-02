export default class AuthenticationModel {
    jwtToken: string = '';
    idUser: string = '';

    constructor(authenticationModel: any) {
        if (authenticationModel === null) {
            return;
        }
        this.jwtToken = authenticationModel.jwtToken;
        this.idUser = authenticationModel.idUser;
    }

    getJwtToken(): string {
        return this.jwtToken;
    }

    getIdUser(): string {
        return this.idUser;
    }

    hasJwtToken(): boolean {
        return this.jwtToken !== '' && this.jwtToken !== null;
    }
}
