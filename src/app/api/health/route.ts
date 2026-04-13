import { prisma } from "@/lib/prisma";

// GET database health check
export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    return Response.json({
      status: "connected",
      database: "PostgreSQL (Supabase)",
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    return Response.json(
      {
        status: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
