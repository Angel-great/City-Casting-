import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcryptjs";
import { createToken, generateCustomerCode, generatePin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, companyName, phone } = body;

    if (!email || !password || !firstName || !lastName) {
      return Response.json(
        { error: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = hashSync(password, 10);
    const customerCode = generateCustomerCode();
    const pin = generatePin();

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        companyName: companyName || null,
        phone: phone || null,
        role: "CUSTOMER",
        customerCode,
        pin,
      },
    });

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      customerCode: user.customerCode,
      department: user.department,
    });

    const response = Response.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        customerCode: user.customerCode,
        pin: user.pin,
        role: user.role,
      },
      message: `Account created! Your customer code is ${customerCode} and your PIN is ${pin}. Please save these.`,
    });

    response.headers.set(
      "Set-Cookie",
      `session-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
