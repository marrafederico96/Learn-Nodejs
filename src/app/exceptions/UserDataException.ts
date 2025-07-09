export class UserDataException extends Error {
    constructor() {
        super(`Wrong credentials`);
        this.name = "UserDataException";
    }

}