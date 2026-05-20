import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (session.role === "CUSTOMER") {
      where.customerId = session.id;
    } else if (customerId) {
      where.customerId = customerId;
    }

    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            companyName: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderType: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalOutstanding = invoices
      .filter((inv) => inv.status !== "PAID")
      .reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0);

    return Response.json({ invoices, totalOutstanding });
  } catch (error) {
    console.error("Get invoices error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
