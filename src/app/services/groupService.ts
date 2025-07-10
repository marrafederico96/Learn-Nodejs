import { GroupDto } from "../dto/GroupDto";
import { GroupRepository } from "../repository/groupRepository";

export class GroupService {
    private groupRepository = new GroupRepository();

    async createGroup(group: GroupDto) {
        await this.groupRepository.createGroup(group);
    }

}