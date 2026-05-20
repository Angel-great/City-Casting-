import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "CUSTOMER") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      role: "CUSTOMER",
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { companyName: { contains: search } },
        { customerCode: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const customers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        phone: true,
        customerCode: true,
        paymentTerms: true,
        creditLimit: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            molds: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ customers });
  } catch (error) {
    console.error("Get customers error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
