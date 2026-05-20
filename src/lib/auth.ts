import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "city-casting-corp-secret-key-change-in-production"
);

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  customerCode?: string | null;
  department?: string | null;
}

export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload as { user: SessionUser }).user;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(
  ...roles: string[]
): Promise<SessionUser> {
  const session = await requireAuth();
  if (!roles.includes(session.role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export function generateCustomerCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "CC-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateOrderNumber(dailyCount: number): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString().slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  return `ORD-${dateStr}-${String(dailyCount).padStart(4, "0")}`;
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString().slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${rand}`;
}
