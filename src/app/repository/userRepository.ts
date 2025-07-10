import sql from "../../db";
import { UserInfoDto } from "../dto/UserDto";
import { UserException } from "../exceptions/UserException";
import { UserModel } from "../models/userModel";

export class UserRepository {

    async addUser(user: UserInfoDto) {
        const result = await sql`
        INSERT INTO users (username, email, first_name, last_name, password_hash) 
        VALUES (${user.username}, ${user.email}, ${user.first_name}, ${user.last_name}, ${user.password_hash})`;

    }

    async findUserByUserId(user_id: number): Promise<UserModel | null> {
        const result = await sql`
            SELECT user_id, username, email, first_name, last_name, password_hash 
            FROM users 
            WHERE user_id=${user_id}`;

        if (result.length === 0) {
            throw new UserException("User not found");
        }
        const user: UserModel = {
            user_id: result[0].user_id,
            username: result[0].username,
            email: result[0].email,
            first_name: result[0].first_name,
            last_name: result[0].last_name,
            password_hash: result[0].password_hash
        }
        return user;

    }

    async findUserByUsername(username: string): Promise<UserModel | null> {
        const result = await sql`
            SELECT user_id, username, email, first_name, last_name, password_hash 
            FROM users 
            WHERE username=${username}`;

        if (result.length === 0) {
            return null;
        }

        const user: UserModel = {
            user_id: result[0].user_id,
            username: result[0].username,
            email: result[0].email,
            first_name: result[0].first_name,
            last_name: result[0].last_name,
            password_hash: result[0].password_hash
        }

        return user;
    }

    async deleteUser(user: UserModel) {
        await sql`DELETE FROM users WHERE user_id=${user.user_id}`;
    }
}