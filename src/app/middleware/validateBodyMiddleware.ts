import { Request, Response, NextFunction } from "express";
import * as z from "zod/v4"

export const validateBody = (schema: z.ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.issues });
            }
            return res.status(400).json({ error: error.message });
        }
    }
}