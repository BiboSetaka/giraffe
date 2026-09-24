import crypto from "node:crypto";

const COOKIE_NAME = "giraffe_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET env var is not set");
  return s;
}

// Token = "<expiryTimestamp>.<hmacSignature>" — stateless, nothing stored server-side.
export function createSessionToken() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const sig = crypto.createHmac("sha256", secret()).update(String(expires)).digest("hex");
  return `${expires}.${sig}`;
}

export function verifySessionToken(token) {
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig) return false;
  if (Date.now() > Number(expires)) return false;
  const expected = crypto.createHmac("sha256", secret()).update(expires).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false; // different lengths etc.
  }
}

export const ADMIN_COOKIE = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};
