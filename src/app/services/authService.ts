import { UserInfoDto, UserLoginDto, UsernameDto, UserRegisterDto } from "../dto/UserDto";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repository/userRepository";
import Bcrypt from "bcrypt";
import { RefreshTokenRepository } from "../repository/refreshTokenRepository";
import { RefreshTokenDto } from "../dto/RefreshTokenDto";
import { TokenService } from "./tokenService";
import { UserException } from "../exceptions/UserException";
import { UUID } from "crypto";

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
            username: userData.username.toLowerCase().trim(),
            first_name: userData.first_name.trim(),
            last_name: userData.last_name.trim(),
            email: userData.email.trim().toLowerCase(),
            password_hash: (await Bcrypt.hash(userData.password, 10)).trim()
        }

        this.userRepository.addUser(newUser);
    }


    async loginUser(userData: UserLoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        const user: UserModel | null = await this.userRepository.findUserByUsername(userData.username.toLowerCase().trim());

        if (user === null) {
            throw new UserException("User not found");
        }

        const result = await Bcrypt.compare(userData.password.trim(), user.password_hash);
        if (result) {
            return this.tokenService.generateToken(user);
        } else {
            throw new UserException("Wrong credentials");
        }
    }


    async logoutUser(username: string) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username.toLowerCase().trim());

        if (user === null) {
            throw new UserException("User not found");
        }

        const tokenList: Array<RefreshTokenDto> = await this.refreshTokenRepository.findRefreshTokenByUserId(user.user_id);
        for (let t of tokenList) {
            await this.refreshTokenRepository.invalidRefreshToken(t.token_value);
        }
    }


    async deleteUser(username: string) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username.trim().toLowerCase());

        if (user === null) {
            throw new UserException("User not found");
        }

        await this.userRepository.deleteUser(user);
    }

    async refreshToken(username: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user: UserModel | null = await this.userRepository.findUserByUsername(username.trim().toLowerCase());
        if (user === null) {
            throw new UserException("User not found");
        }

        return await this.tokenService.generateToken(user);

    }

    async getUsernameByToken(token_value: UUID): Promise<UsernameDto> {
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