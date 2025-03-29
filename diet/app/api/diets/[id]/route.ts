// Temporarily disable API routes
export const dynamic = "force-static";
export const runtime = "edge";

export async function GET() {
  return new Response(JSON.stringify({ message: "API temporarily disabled" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({ message: "API temporarily disabled" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
