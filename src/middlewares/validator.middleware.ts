import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => err.message);
      res.status(400).json({ errors: errorMessages });
      return;
    }
    // Handle other types of errors if necessary
   res.status(500).json({ error: 'Internal Server Error' });
   return ;
  }
};