import sql from "../../db";
import { RefreshTokenDto } from "../dto/RefreshTokenDto";

export class RefreshTokenRepository {

    async addRefreshToken(refresh_token: RefreshTokenDto) {
        await sql`INSERT INTO  refresh_tokens (token_value, create_date, expire_date, valid, user_id)
        VALUES (${refresh_token.token_value}, ${refresh_token.create_date}, ${refresh_token.expire_date}, ${refresh_token.valid}, ${refresh_token.user_id})`;
    }

    async invalidRefreshToken(refresh_token: string) {
        await sql`UPDATE refresh_tokens SET valid = false WHERE token_value=${refresh_token}`;
    }

    async findRefreshTokenByUserId(user_id: number): Promise<Array<RefreshTokenDto>> {
        return await sql`SELECT token_value, valid FROM refresh_tokens WHERE user_id=${user_id} AND valid=true`;
    }
}