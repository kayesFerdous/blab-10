import { db } from "@/db";
import { userRooms, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export interface UserInfo {
  userId?: string
  name?: string | null
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const roomId = (await params).roomId;

  try {
    const response: UserInfo[] = await db
      .select({
        userId: userRooms.userId,
        name: users.name,
      })
      .from(userRooms)
      .innerJoin(users, eq(userRooms.userId, users.id))
      .where(eq(userRooms.roomId, roomId));

    return NextResponse.json({ users: response }, { status: 200 });
  } catch (error) {
    console.log("Error getting user list", error);
    return NextResponse.json({ status: 500 });
  }
}
