import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Token invalido o expirado, por favor inicia sesión",
      notoken: true,
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({
      success: false,
      message: "Token invalido o expirado, por favor inicia sesión",
      notoken: true,
    });
    return;
  }

  (req as any).userId = decoded.userId;

  next();
};
