import { Request, Response } from "express";
import { GroupMemberService } from "../services/groupMemberService";

export class GroupMemberController {
    private groupMemeberService = new GroupMemberService();

    async add(req: Request, res: Response) {
        try {
            await this.groupMemeberService.addMember(req.body);
            res.status(200).json({ message: "Member added to group" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            await this.groupMemeberService.removeMember(req.body);
            res.status(200).json({ message: "Member removed" })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}