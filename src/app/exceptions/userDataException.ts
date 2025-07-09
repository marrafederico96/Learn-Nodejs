import { UserModel } from "../models/userModel";

export class UserDataException extends Error {
    constructor() {
        super(`User already exists`);
        this.name = "UserDataException";
    }

}