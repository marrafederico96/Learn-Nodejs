import { randomUUID, UUID } from "crypto";
import { RefreshTokenDto } from "../dto/RefreshTokenDto";
import { UserModel } from "../models/userModel";
import jwt from "jsonwebtoken";
import fs from "fs";
import { RefreshTokenRepository } from "../repository/refreshTokenRepository";
import { UserRepository } from "../repository/userRepository";
import { UserException } from "../exceptions/UserException";
import { UserInfoDto } from "../dto/UserInfoDto";
import { UsernameDto } from "../dto/UsernameDto";

export class TokenService {
    private privateKey = fs.readFileSync('./secrets/keys/key.pem');
    private refreshTokenRepository = new RefreshTokenRepository();
    private userRepository = new UserRepository();

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

    async getUserByToken(token_value: UUID): Promise<UsernameDto> {
        const token: RefreshTokenDto = await this.refreshTokenRepository.findRefreshTokenByTokenValue(token_value);
        const user: UserModel | null = await this.userRepository.findUserByUserId(token.user_id);

        if (!user) {
            throw new UserException("User not found");
        }

        const username: UsernameDto = {
            username: user.username,
        }

        return username;

    }
}