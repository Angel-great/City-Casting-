import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, generateOrderNumber } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const orderType = searchParams.get("orderType");
    const search = searchParams.get("search");
    const customerId = searchParams.get("customerId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};

    if (session.role === "CUSTOMER") {
      where.customerId = session.id;
    } else if (customerId) {
      where.customerId = customerId;
    }

    if (status) where.status = status;
    if (orderType) where.orderType = orderType;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              companyName: true,
              customerCode: true,
            },
          },
          manager: {
            select: { id: true, firstName: true, lastName: true },
          },
          items: true,
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return Response.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderType, customerId, items, notes } = body;

    const targetCustomerId =
      session.role === "CUSTOMER" ? session.id : customerId;

    if (!targetCustomerId) {
      return Response.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    if (!orderType) {
      return Response.json(
        { error: "Order type is required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrderCount = await prisma.order.count({
      where: { createdAt: { gte: today } },
    });

    const orderNumber = generateOrderNumber(todayOrderCount + 1);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        orderType,
        customerId: targetCustomerId,
        managerId:
          session.role !== "CUSTOMER" ? session.id : null,
        notes: notes || null,
        items: {
          create: (items || []).map(
            (item: {
              styleName?: string;
              imageUrl?: string;
              metal?: string;
              moldType?: string;
              moldId?: string;
              quantity?: number;
              waxSize?: string;
              polishingServices?: string[];
              printType?: string;
              fileUrl?: string;
              fileType?: string;
              cadEditNotes?: string;
              notes?: string;
            }) => ({
              styleName: item.styleName || null,
              imageUrl: item.imageUrl || null,
              metal: item.metal || null,
              moldType: item.moldType || null,
              moldId: item.moldId || null,
              quantity: item.quantity || 1,
              waxSize: item.waxSize || null,
              polishingServices: item.polishingServices
                ? JSON.stringify(item.polishingServices)
                : null,
              printType: item.printType || null,
              fileUrl: item.fileUrl || null,
              fileType: item.fileType || null,
              cadEditNotes: item.cadEditNotes || null,
              notes: item.notes || null,
            })
          ),
        },
        statusHistory: {
          create: {
            status: "CREATED",
            changedBy: session.id,
            notes: "Order created",
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
            customerCode: true,
          },
        },
        items: true,
      },
    });

    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
