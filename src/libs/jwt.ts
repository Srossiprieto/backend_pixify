import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export function createAccessToken(payload: object): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!JWT_SECRET) {
            return reject(new Error("JWT_SECRET is not defined"));
        }

        jwt.sign(
            payload,
            JWT_SECRET,
            {
                expiresIn: '1d',
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token as string);
            }
        );
    });
}