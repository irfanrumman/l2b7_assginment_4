import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/AppError";
import httpStatus from "http-status";


declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
    }
  }
}

type ValidationTarget = "body" | "query" | "params";


export const validate =
  <T>(schema: ZodType<T>, target: ValidationTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const targetData = req[target];
    const result = schema.safeParse(targetData);


if (!result.success) {
  const errorMessages = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');

  return next(new AppError(`Validation failed: ${errorMessages}`, httpStatus.BAD_REQUEST));
}


    if (target === 'body') {
      req[target] = result.data; 
    }

    if (target === 'params') {
      req.params = result.data as Record<string, string>; 
    }

    if (target === 'query') {
      req.validatedQuery = result.data; 
    }

    return next();
  };