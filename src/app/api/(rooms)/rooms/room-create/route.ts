import { db } from "@/db";
import { userRooms, users, rooms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId, roomName } = await req.json();

  const alreadyCreateadRoom = await db
    .select({ created: users.createdRoom })
    .from(users)
    .where(eq(users.id, userId));

  if (alreadyCreateadRoom[0].created) {
    return NextResponse.json({ alreadyCreated: true });
  }

  const response = await db
    .insert(rooms)
    .values({ name: roomName, createdBy: userId })
    .returning({ roomId: rooms.id });

  if (response.length > 0) {
    await db
      .update(users)
      .set({ createdRoom: true })
      .where(eq(users.id, userId));

    await db
      .insert(userRooms)
      .values({ userId: userId, roomId: response[0].roomId })
  }

  return NextResponse.json({ alreadyCreatead: false });
}
