import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}