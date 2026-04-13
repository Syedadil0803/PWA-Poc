import { query } from "@/lib/db";
import { NextRequest } from "next/server";

// PATCH - Update an item
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/items/[id]">
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const result = await query(
      "UPDATE items SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, created_at as \"createdAt\", updated_at as \"updatedAt\"",
      [name.trim(), id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update item:", error);
    return Response.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE an item
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/items/[id]">
) {
  try {
    const { id } = await ctx.params;

    await query("DELETE FROM items WHERE id = $1", [id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete item:", error);
    return Response.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
