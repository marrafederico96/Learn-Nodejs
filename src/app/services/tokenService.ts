import { randomUUID } from "crypto";
import { RefreshTokenDto } from "../dto/RefreshTokenDto";
import { UserModel } from "../models/userModel";
import jwt from "jsonwebtoken";
import fs from "fs";
import { RefreshTokenRepository } from "../repository/refreshTokenRepository";

export class TokenService {
    private privateKey = fs.readFileSync('./secrets/keys/key.pem');
    private refreshTokenRepository = new RefreshTokenRepository();

    async generateToken(user: UserModel): Promise<{ accessToken: string, refreshToken: string }> {

        const listTokens = await this.refreshTokenRepository.findRefreshTokenByUserId(user.user_id);
        if (listTokens.length > 0) {
            for (let t of listTokens) {
                await this.refreshTokenRepository.invalidRefreshToken(t.token_value);
            }
        }

        const creationDate = new Date();
        const refreshToken: RefreshTokenDto = {
            token_value: randomUUID(),
            create_date: creationDate,
            expire_date: new Date(creationDate.getTime() + 15 * 24 * 60 * 60 * 1000),
            valid: true,
            user_id: user.user_id
        }

        await this.refreshTokenRepository.addRefreshToken(refreshToken);

        const accessToken = await new Promise<string>((resolve, reject) => {
            jwt.sign(
                { username: user.username },
                this.privateKey,
                { algorithm: "RS256", expiresIn: "10m" },
                (err, token) => {
                    if (token) {
                        resolve(token);
                    } else {
                        reject(new Error("Failed to generate JWT token: " + err));
                    }
                }
            )
        });
        return { accessToken, refreshToken: refreshToken.token_value };
    }

}