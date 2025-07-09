export interface RefreshTokenModel {
    refresh_id: number,
    token_value: string,
    valid: boolean,
    create_date: Date;
    expire_date: Date;
    user_id: number
}