import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretKeyValetinpico";
const JWT_EXPIRES_IN = "5m";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
};
