import { db } from "@/db";
import { messages } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, input, roomId, name } = body;

  const response = await db
    .insert(messages)
    .values({ userId: userId, message: input, roomId: roomId, name: name })

  if (response) {
    return Response.json({ message: "Success fully inserted message" })
  }
}
