import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prices = await prisma.metalPrice.findMany({
      orderBy: [{ metalType: "asc" }, { karat: "desc" }],
    });

    return Response.json({ prices });
  } catch (error) {
    console.error("Get metal prices error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
