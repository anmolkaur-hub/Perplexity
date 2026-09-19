import "dotenv/config";
import jwt from "jsonwebtoken";

export default function authUser(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: "No token provided",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: "Invalid or expired token",
    });
  }
}
