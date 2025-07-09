import { UserModel } from "../models/userModel";

export class UserNotFoundException extends Error {
    constructor(username: string) {
        super(`User ${username} not found`);
        this.name = "UserNotFoundException";
    }
}