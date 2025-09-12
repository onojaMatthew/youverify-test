import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler";

export const verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new AppError("Access denied. Invalid token", 401));
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;
    next();
  } catch (err) {
    return next(new AppError("Invalid token", 403));
  }
}