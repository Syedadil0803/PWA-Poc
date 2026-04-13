import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// DELETE an item
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/items/[id]">
) {
  try {
    const { id } = await ctx.params;

    await prisma.item.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete item:", error);
    return Response.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
