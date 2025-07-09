import { FriendshipDto } from "../dto/FriendshipDto";
import { FriendshipException } from "../exceptions/friendshipException";
import { UserNotFoundException } from "../exceptions/userNotFoundException";
import { RequestState } from "../models/frindshipRequestState";
import { UserModel } from "../models/userModel";
import { FriendshipRepository } from "../repository/friendshipRepository";
import { UserRepository } from "../repository/userRepository";

export class FriendshipService {

    private friendshipRepository = new FriendshipRepository();
    private userRepository = new UserRepository();

    async addFriend(username_sender: string, username_receive: string) {

        const user_sender: UserModel | null = await this.userRepository.findUserByUsername(username_sender);
        const user_receive: UserModel | null = await this.userRepository.findUserByUsername(username_receive);

        if (user_sender && user_receive) {
            const friendship = await this.friendshipRepository.searchFriendship(user_sender, user_receive);
            if (!friendship) {
                const newFriendship: FriendshipDto = {
                    user_sender_id: user_sender.user_id,
                    user_receive_id: user_receive.user_id,
                    request_date: new Date(),
                    request_state: RequestState.PENDING
                }
                await this.friendshipRepository.addFriendship(newFriendship);
            } else {
                throw new FriendshipException();
            }
        } else {
            throw new UserNotFoundException();
        }
    }

}