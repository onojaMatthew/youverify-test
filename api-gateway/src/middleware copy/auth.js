import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next('Access token required', 401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return next('Invalid or expired token', 403);
    }
    req.user = user;
    next();
  });
};