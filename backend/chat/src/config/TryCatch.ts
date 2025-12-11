import type { NextFunction, Request, RequestHandler, Response } from "express";

const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

export default TryCatch;

// express don't handle errors in async functions automatically.

// So we create a higher-order function TryCatch that wraps our async route handlers.

// so we don't have to write try-catch blocks in every controller function.
