import { query } from "@/lib/db";
import { NextRequest } from "next/server";

// GET all items
export async function GET() {
  try {
    const result = await query(
      "SELECT id, name, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM items ORDER BY created_at DESC"
    );
    return Response.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return Response.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const result = await query(
      "INSERT INTO items (name) VALUES ($1) RETURNING id, name, created_at as \"createdAt\", updated_at as \"updatedAt\"",
      [name.trim()]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create item:", error);
    return Response.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
