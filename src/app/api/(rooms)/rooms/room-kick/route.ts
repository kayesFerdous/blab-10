import { db } from "@/db";
import { userRooms } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { userId, roomId } = await req.json();

  try {
    await db
      .delete(userRooms)
      .where(and(
        eq(userRooms.userId, userId),
        eq(userRooms.roomId, roomId)
      ))
    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.log("Error kicking user", error)
    return NextResponse.json({ status: 500 })
  }
}
