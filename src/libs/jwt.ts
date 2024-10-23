import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Define el tipo de retorno de la promesa (puede ser `string` o `undefined` si no se genera el token)
export function createAccessToken(payload: object): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        const options: SignOptions = {
            expiresIn: '1d',
        };

        jwt.sign(payload, JWT_SECRET as string, options, (err, token) => {
            if (err) {
                reject(err); // Si hay un error, se rechaza la promesa
            }
            resolve(token); // Si no hay error, se resuelve con el token (puede ser `string` o `undefined`)
        });
    });
}
