import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Define el tipo para el payload
interface Payload {
  [key: string]: any;
}

// Define el tipo de retorno de la función
export async function createAccessToken(payload: Payload): Promise<string> {
  return new Promise((resolve, reject) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return reject(new Error("JWT_SECRET is not defined"));
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
}