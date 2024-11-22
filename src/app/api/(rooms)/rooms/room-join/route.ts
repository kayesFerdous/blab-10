import { auth } from "@/auth";
import { db } from "@/db";
import { pendingRequests, rooms, userRooms } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { SelectRooms } from "@/db/schema";
import { JoinRequestStatus } from "@/types/rooms";

export async function POST(req: Request) {
  const { roomId } = await req.json();
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const roomExists: SelectRooms[] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId));

    if (roomExists.length === 0) {
      return NextResponse.json({ message: "Room doesn't exists", result: JoinRequestStatus.NOT_FOUND });
    }

    const joinedRooms = await db
      .select()
      .from(userRooms)
      .where(eq(userRooms.userId, userId));

    if (joinedRooms.length >= 4) {
      return NextResponse.json({ message: "You can't join more than three rooms", result: JoinRequestStatus.MORE_THAN_THREE_ROOMS })
    }

    const existingRequest = await db
      .select()
      .from(pendingRequests)
      .where(and(
        eq(pendingRequests.userId, userId),
        eq(pendingRequests.roomId, roomId)
      ))

    if (existingRequest.length > 0) {
      return NextResponse.json({ message: "You have already requested to join", result: JoinRequestStatus.ALREADY_REQUESTED })
    }

    const roomMember = await db
      .select()
      .from(userRooms)
      .where(and(
        eq(userRooms.userId, userId),
        eq(userRooms.roomId, roomId)
      ))

    if (roomMember.length > 0) {
      console.log(roomMember, userId);
      return NextResponse.json({ message: "Already a member of this room", result: JoinRequestStatus.ALREADY_MEMBER })
    }

    await db
      .insert(pendingRequests)
      .values({ userId, roomId })

    return NextResponse.json({ message: "Success", result: JoinRequestStatus.SUCCESS })

  } catch (error) {
    return NextResponse.json({ message: `Error while requestng for joining: \n${error}`, result: JoinRequestStatus.ERROR })
  }
}
