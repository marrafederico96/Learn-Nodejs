import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { UserRegisterSchema } from "../dto/UserRegisterDto";
import z from "zod/v4";
import { UserLoginSchema } from "../dto/UserLoginDto";

export class AuthController {
    private userService = new AuthService();


    async register(req: Request, res: Response) {
        try {
            await this.userService.registerUser(await UserRegisterSchema.parseAsync(req.body));
            res.status(201).json({ message: "User registered successfully" });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.issues })
            }

            res.status(400).json({ error: error.message })

        }
    }

    async login(req: Request, res: Response) {
        try {
            const token = await this.userService.loginUser(await UserLoginSchema.parseAsync(req.body));
            res.cookie("refresh_token", token.refreshToken, {
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "strict",
                path: "/auth/refresh"
            });
            res.status(201).json({ access_token: token.accessToken });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues })
            }
            res.status(400).json({ error: error.message })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const username = (req as any).user?.username;
            if (!username) {
                return res.status(401).json({ error: "Utente non autenticato" });
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
                return res.status(401).json({ error: "Utente non autenticato" });
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
}