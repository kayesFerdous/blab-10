import { auth } from "@/auth";
import { db } from "@/db";
import { rooms, userRooms } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const globalRoomId = process.env.GLOBAL_ROOM_ID!;

  try {
    const roomsForUser = await db
      .select({
        Id: userRooms.roomId,
        title: rooms.name,
      })
      .from(userRooms)
      .innerJoin(rooms, eq(userRooms.roomId, rooms.id))
      .where(eq(userRooms.userId, session?.user?.id));

    const allRooms = await db
      .select({
        Id: rooms.id,
        title: rooms.name
      })
      .from(rooms)
      .where(ne(rooms.id, globalRoomId));

    return NextResponse.json({ roomsForUser, allRooms }, { status: 200 });
  } catch (error) {
    console.log("Error getting rooms")
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


