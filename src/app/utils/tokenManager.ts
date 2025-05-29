import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY!;

export function createToken(
  id: string,
  email: string,
  expiresInSeconds = 60 * 60 * 24 * 7
) {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
}
