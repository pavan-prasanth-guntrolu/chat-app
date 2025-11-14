import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login-no auth header",
      });
      return;
    }

    const token = authHeader.split(" ")[1] as string;

    const decodedValue = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as JwtPayload;
    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        message: "Invalid Token",
      });
      return;
    }

    req.user = decodedValue.user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Please login",
    });
  }
};

export default isAuth;
