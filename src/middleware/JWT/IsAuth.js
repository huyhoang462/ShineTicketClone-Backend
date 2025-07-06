import jwt from "jsonwebtoken";

const { verify } = jwt;

const authenticate = (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(401).json({
      message: "Authorization header is required",
    });
  }

  const token = authorization.split(" ")[1];
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token!" });
    }
    req.userid = decoded.userid;

    next();
  });
};

export { authenticate };
