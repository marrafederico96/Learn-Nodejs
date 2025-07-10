import { Request, Response } from "express";
import { FriendshipService } from "../services/friendshipService";

export class FriendshipController {
    private friendship = new FriendshipService();

    async addFriend(req: Request, res: Response) {
        try {
            const username_sender = (req as any).user?.username;
            await this.friendship.addFriend(username_sender, req.body.username);
            res.status(200).json({ message: "Friendship request send" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteFriend(req: Request, res: Response) {
        try {
            const username_sender = (req as any).user?.username;
            await this.friendship.deleteFriend(username_sender, req.body.username);
            res.status(200).json({ message: "Friendship delete" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async accept(req: Request, res: Response) {
        try {
            const username_receiver = (req as any).user?.username;
            await this.friendship.acceptRequest(req.body.username, username_receiver);
            res.status(200).json({ message: "Request state frinedhsip accepted" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

}