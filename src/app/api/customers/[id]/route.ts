import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "CUSTOMER") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const customer = await prisma.user.findUnique({
      where: { id },
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
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { items: true },
        },
        molds: {
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!customer) {
      return Response.json({ error: "Customer not found" }, { status: 404 });
    }

    return Response.json({ customer });
  } catch (error) {
    console.error("Get customer error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      session.role !== "ACCOUNT_MANAGER" &&
      session.role !== "EXECUTIVE"
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { paymentTerms, creditLimit, isActive } = body;

    const updateData: Record<string, unknown> = {};
    if (paymentTerms !== undefined) updateData.paymentTerms = paymentTerms;
    if (creditLimit !== undefined) updateData.creditLimit = creditLimit;
    if (isActive !== undefined) updateData.isActive = isActive;

    const customer = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        paymentTerms: true,
        creditLimit: true,
        isActive: true,
      },
    });

    return Response.json({ customer });
  } catch (error) {
    console.error("Update customer error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
