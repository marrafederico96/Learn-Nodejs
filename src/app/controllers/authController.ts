import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class AuthController {
    private userService = new UserService();

    async register(req: Request, res: Response) {
        try {
            await this.userService.registerUser(req.body);
            res.status(201).json({ message: "User registered successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const token = await this.userService.loginUser(req.body);
            res.cookie("refresh_token", token.refreshToken, {
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "strict",
                path: "/auth/refresh"
            });
            res.status(201).json({ access_token: token.accessToken });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const username = (req as any).user?.username;
            if (!username) {
                return res.status(401).json({ error: "User not authenitcated" });
            }
            await this.userService.logoutUser(username);
            res.clearCookie("refresh_token", {
                path: "/auth/refresh",
                secure: true,
                httpOnly: true,
                sameSite: "strict"
            })
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const username = (req as any).user?.username;
            if (!username) {
                return res.status(401).json({ error: "User not authenitcated" });
            }
            await this.userService.deleteUser(username);
            res.clearCookie("refresh_token", {
                path: "/auth/refresh",
                secure: true,
                httpOnly: true,
                sameSite: "strict"
            })
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const username = await this.userService.getUsernameByToken(req.cookies['refresh_token']);
            const token = await this.userService.refreshToken(username.username);
            res.cookie("refresh_token", token.refreshToken, {
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "strict",
                path: "/auth/refresh"
            });
            res.status(201).json({ access_token: token.accessToken });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}