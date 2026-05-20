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

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            companyName: true,
            customerCode: true,
            phone: true,
            email: true,
          },
        },
        manager: {
          select: { id: true, firstName: true, lastName: true },
        },
        items: {
          include: {
            mold: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (session.role === "CUSTOMER" && order.customerId !== session.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
