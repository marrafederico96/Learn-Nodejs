import jwt from "jsonwebtoken";
import fs from "fs";
import { Request, Response, NextFunction } from "express";


export function checkJwt(req: Request, res: Response, next: NextFunction) {
    const publicKey = fs.readFileSync('./secrets/keys/public.pem');

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid jwt" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (error, decoded) => {
        if (error || typeof decoded !== 'object' || !('username' in decoded)) {
            return res.status(401).json({ error: "Invalid or expire token" });
        }
        (req as any).user = { username: (decoded as any).username };
        next();
    });

};