import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
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
    const body = await request.json();
    const { status, department, notes } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        currentDept: department || undefined,
        placedAt: status === "PLACED" ? new Date() : undefined,
        statusHistory: {
          create: {
            status,
            department: department || null,
            changedBy: session.id,
            notes: notes || null,
          },
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            companyName: true,
          },
        },
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return Response.json({ order });
  } catch (error) {
    console.error("Update order status error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
