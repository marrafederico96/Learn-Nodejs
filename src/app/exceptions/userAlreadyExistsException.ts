import { UserModel } from "../models/userModel";

export class UserAlreadyExiststException extends Error {
    constructor() {
        super(`User already exists`);
        this.name = "UserAlreadyExiststException";
    }

}