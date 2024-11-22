import { db } from "@/db";
import { rooms, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { roomId, userId } = await req.json();

  try {
    await db
      .delete(rooms)
      .where(eq(rooms.id, roomId))

    await db
      .update(users)
      .set({ createdRoom: false })
      .where(eq(users.id, userId))

    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.log("Error destroying the room", error);
    return NextResponse.json({ status: 500 })
  }
}
