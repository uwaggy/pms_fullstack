import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export const validateRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        if (error.constraints) {
          return Object.values(error.constraints);
        }
        return [];
      }).flat();

      return res.status(400).json({
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    req.body = dtoObject;
    next();
  };
}; 