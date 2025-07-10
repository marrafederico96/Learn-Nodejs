import { GroupException } from "../exceptions/groupException";
import { UserException } from "../exceptions/UserException";
import { GroupModel } from "../models/groupModel";
import { UserModel } from "../models/userModel";
import { GroupRepository } from "../repository/groupRepository";
import { UserRepository } from "../repository/userRepository";

export class GroupService {
    private groupRepository = new GroupRepository();
    private userRepository = new UserRepository();

    async createGroup(admin_username: string, group_name: string) {
        const admin_user: UserModel | null = await this.userRepository.findUserByUsername(admin_username);
        if (!admin_user) {
            throw new UserException("User admin not found");
        }
        await this.groupRepository.createGroup(admin_user.user_id, group_name);
    }

    async deleteGroup(admin_username: string, group_name: string) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(admin_username);
        if (user) {
            const group: GroupModel | null = await this.groupRepository.findGroupByGroupNameAndAdminId(user, group_name);
            if (group === null) {
                throw new GroupException("Group not found");
            }
            await this.groupRepository.deleteGroup(group);
        }
    }

}