import { UserLoginDto } from "../dto/UserLoginDto";
import { UserRegisterDto } from "../dto/UserRegisterDto";
import { UserDataException } from "../exceptions/userDataException";
import { UserNotFoundException } from "../exceptions/userNotFoundException";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repository/userRepository";
import Bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import { randomUUID } from "crypto";
import { RefreshTokenRepository } from "../repository/refreshTokenRepository";
import { UserInfoDto } from "../dto/UserInfoDto";
import { RefreshTokenDto } from "../dto/RefreshTokenDto";

export class AuthService {

    private privateKey = fs.readFileSync('./secrets/keys/key.pem');

    private userRepository = new UserRepository();
    private refreshTokenRepository = new RefreshTokenRepository();

    async registerUser(userData: UserRegisterDto) {

        const user: UserModel | null = await this.userRepository.findUserByUsername(userData.username);

        if (user !== null) {
            throw new UserDataException();
        }

        const newUser: UserInfoDto = {
            username: userData.username,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password_hash: await Bcrypt.hash(userData.password, 10)
        }

        this.userRepository.addUser(newUser);
    }

    async loginUser(userData: UserLoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        const user: UserModel | null = await this.userRepository.findUserByUsername(userData.username);

        if (user === null) {
            throw new UserNotFoundException(userData.username);
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
            );
        });

        return { accessToken, refreshToken: refreshToken.token_value };

    }

    async logoutUser(username: string) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username);

        if (user === null) {
            throw new UserNotFoundException(username);
        }

        const tokenList: Array<RefreshTokenDto> = await this.refreshTokenRepository.findRefreshTokenByUserId(user.user_id);
        for (let t of tokenList) {
            await this.refreshTokenRepository.invalidRefreshToken(t.token_value);
        }
    }

    async deleteUser(username: string) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username);

        if (user === null) {
            throw new UserNotFoundException(username);
        }

        await this.userRepository.deleteUser(user);
    }
}