import { UserLoginDto } from "../dto/UserLoginDto";
import { UserRegisterDto } from "../dto/UserRegisterDto";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repository/userRepository";
import Bcrypt from "bcrypt";
import { RefreshTokenRepository } from "../repository/refreshTokenRepository";
import { UserInfoDto } from "../dto/UserInfoDto";
import { RefreshTokenDto } from "../dto/RefreshTokenDto";
import { TokenService } from "./tokenService";
import { UserException } from "../exceptions/UserException";

export class AuthService {
    private userRepository = new UserRepository();
    private refreshTokenRepository = new RefreshTokenRepository();
    private tokenService = new TokenService();


    async registerUser(userData: UserRegisterDto) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(userData.username);

        if (user !== null) {
            throw new UserException("User already exists");
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
            throw new UserException("User not found");
        }

        const result = await Bcrypt.compare(userData.password, user.password_hash);
        if (result) {
            return this.tokenService.generateToken(user);
        } else {
            throw new UserException("Wrong credentials");
        }
    }


    async logoutUser(username: string) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username);

        if (user === null) {
            throw new UserException("User not found");
        }

        const tokenList: Array<RefreshTokenDto> = await this.refreshTokenRepository.findRefreshTokenByUserId(user.user_id);
        for (let t of tokenList) {
            await this.refreshTokenRepository.invalidRefreshToken(t.token_value);
        }
    }


    async deleteUser(username: string) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username);

        if (user === null) {
            throw new UserException("User not found");
        }

        await this.userRepository.deleteUser(user);
    }

    async refreshToken(username: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username);
        if (user === null) {
            throw new UserException("User not found");
        }

        return await this.tokenService.generateToken(user);

    }
}