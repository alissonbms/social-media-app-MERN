import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.lenght).trimLeft();
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifiedToken) {
      return res.status(403).json({ message: "Access Denied" });
    }

    req.user = verifiedToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
