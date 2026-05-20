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
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (session.role === "CUSTOMER") {
      where.customerId = session.id;
    } else if (customerId) {
      where.customerId = customerId;
    }

    if (search) {
      where.OR = [
        { styleNumber: { contains: search } },
        { styleName: { contains: search } },
      ];
    }

    const molds = await prisma.mold.findMany({
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
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ molds });
  } catch (error) {
    console.error("Get molds error:", error);
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

    if (session.role === "CUSTOMER") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      customerId,
      styleNumber,
      styleName,
      imageUrl,
      moldMaterial,
      notes,
    } = body;

    const mold = await prisma.mold.create({
      data: {
        customerId,
        styleNumber,
        styleName: styleName || null,
        imageUrl: imageUrl || null,
        moldMaterial: moldMaterial || null,
        notes: notes || null,
      },
    });

    return Response.json({ mold }, { status: 201 });
  } catch (error) {
    console.error("Create mold error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
