import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import ServerResponse from '../utils/ServerResponse';


//function validates the incoming request body against a given class (DTO) using class-validator and class-transformer
export function validationMiddleware<T>(
    type: any,
    skipMissingProperties = false
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
      //Converts the plain request body into an instance of the specified class
        const dto = plainToInstance(type, req.body);
        //If validation errors exist, it sends a response with the first error message.
        const errors = await validate(dto, { skipMissingProperties });
        if (errors.length > 0) {
            ServerResponse.error(res, Object.values(errors[0]?.constraints as {})[0] as string);
        } else {
            req.body = dto;
            next();
        }
    };
}
