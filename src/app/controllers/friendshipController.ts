import { Request, Response } from "express";
import { FriendshipService } from "../services/friendshipService";

export class FriendshipController {
    private friendship = new FriendshipService();

    async addFriend(req: Request, res: Response) {
        try {
            const username_sender = (req as any).user?.username;
            await this.friendship.addFriend(username_sender, req.body.username_receive);
            res.status(200).json({ message: "Friendship request send" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }


    }

}