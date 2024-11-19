import { db } from "@/db";
import { pendingRequests, userRooms } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { roomId, userId, action } = await req.json();
  console.log(roomId, userId, action);

  try {
    await db
      .delete(pendingRequests)
      .where(and(
        eq(pendingRequests.userId, userId),
        eq(pendingRequests.roomId, roomId)
      ))

    if (action === "approve") {
      await db
        .insert(userRooms)
        .values({ userId: userId, roomId: roomId });
    }

    return NextResponse.json({ status: 200 });

  } catch (error) {
    console.error("Error handling pending user request", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
