import { Request, Response } from "express";
import { GroupService } from "../services/groupService";
import { GroupException } from "../exceptions/groupException";

export class GroupController {
    private groupService = new GroupService();

    async create(req: Request, res: Response) {
        try {
            const admin_username = (req as any).user?.username;
            if (!admin_username) {
                res.status(400).json({ error: "User not authenitcated" });
            }
            await this.groupService.createGroup(admin_username, req.body.group_name);
            res.status(200).json({ message: "Group created" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const admin_username: string = (req as any).user?.username;
            if (!admin_username) {
                res.status(400).json({ error: "User not authenitcated" });
            }
            this.groupService.deleteGroup(admin_username, req.body.group_name);
            res.status(200).json({ message: "Group deleted" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}