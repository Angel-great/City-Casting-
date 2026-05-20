import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { compareSync } from "bcryptjs";
import { createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, customerCode, pin } = body;

    let user;

    if (customerCode && pin) {
      user = await prisma.user.findUnique({
        where: { customerCode },
      });
      if (!user || user.pin !== pin) {
        return Response.json(
          { error: "Invalid customer code or PIN" },
          { status: 401 }
        );
      }
    } else if (email && password) {
      user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user || !compareSync(password, user.passwordHash)) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } else {
      return Response.json(
        { error: "Provide email/password or customer code/PIN" },
        { status: 400 }
      );
    }

    if (!user.isActive) {
      return Response.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

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
        role: user.role,
        department: user.department,
      },
    });

    response.headers.set(
      "Set-Cookie",
      `session-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
