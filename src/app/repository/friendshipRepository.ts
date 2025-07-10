import sql from "../../db";
import { FriendshipDto } from "../dto/FriendshipDto";
import { FriendshipException } from "../exceptions/friendshipException";
import { FriendshipModel } from "../models/friendshipModel";
import { UserModel } from "../models/userModel";


export class FriendshipRepository {

    async addFriendship(friendships: FriendshipDto) {
        await sql`
        INSERT INTO friendships (user_sender_id, user_receive_id, request_date, request_state) 
        VALUES (${friendships.user_sender_id}, ${friendships.user_receive_id}, ${friendships.request_date}, ${friendships.request_state})`;
    }

    async deleteFriendship(friendship: FriendshipModel) {
        await sql`DELETE FROM friendships WHERE friendship_id=${friendship.friendship_id}`;
    }

    async acceptRequest(friendship: FriendshipModel) {
        await sql`UPDATE friendships SET request_state = 'ACCEPTED' WHERE friendship_id=${friendship.friendship_id} AND request_state = 'PENDING'`;
    }

    async searchFriendship(user_sender: UserModel, user_receive: UserModel): Promise<FriendshipModel | null> {
        const result = await sql`
        SELECT * FROM friendships 
        WHERE (user_sender_id=${user_sender.user_id} AND user_receive_id=${user_receive.user_id}) 
        OR (user_sender_id=${user_receive.user_id} AND user_receive_id=${user_sender.user_id})`;

        if (result.length === 0) {
            throw new FriendshipException("Friendship not found");
        }

        const friendship: FriendshipModel = {
            friendship_id: result[0].friendship_id,
            user_receive_id: result[0].user_receive_id,
            user_sender_id: result[0].user_sender_id,
            request_date: result[0].request_date,
            request_state: result[0].request_state
        }

        return friendship;
    }


}