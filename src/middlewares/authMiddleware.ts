import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(403).json({ error: 'Token missing' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, decoded) => {
        if (err) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        req.body.user = decoded;
        next();
    });
};
