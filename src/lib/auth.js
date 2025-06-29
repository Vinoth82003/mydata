import jwt from "jsonwebtoken";

export function signToken(payload, keepSignedIn = false) {
  const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: keepSignedIn ? "7d" : "15m", 
  });

  const refreshToken = keepSignedIn
    ? jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" })
    : null;

  return { accessToken, refreshToken };
}

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}
