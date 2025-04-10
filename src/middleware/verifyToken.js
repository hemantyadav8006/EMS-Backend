import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user ID & email
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};
