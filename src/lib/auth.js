import jwt from "jsonwebtoken";
export function signToken(data, remember) {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: remember ? "7d" : "1h",
  });
}
