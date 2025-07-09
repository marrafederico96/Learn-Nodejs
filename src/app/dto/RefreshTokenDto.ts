export interface RefreshTokenDto {
    token_value: string,
    valid: boolean,
    create_date: Date;
    expire_date: Date;
    user_id: number
}