export class FriendshipException extends Error {
    constructor() {
        super(`Friendship already exists`);
        this.name = "FriendshipException";
    }

}