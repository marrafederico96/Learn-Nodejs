export interface GroupMemberModel {
    member_id: number,
    join_date: Date,
    member_role: MemberRole,
    user_id: number,
    group_id: number
}

export enum MemberRole {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN"
}