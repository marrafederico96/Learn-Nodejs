
export interface FriendshipModel {
    friendship_id: number,
    user_sender_id: number,
    user_receive_id: number,
    request_date: Date,
    request_state: RequestState
}

export enum RequestState {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINE = "DECLINE"
}