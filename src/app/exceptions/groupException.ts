export class GroupException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GroupException";
    }

}