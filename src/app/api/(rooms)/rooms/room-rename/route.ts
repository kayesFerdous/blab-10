import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { roomId, newName } = await req.json();

  try {
    await db
      .update(rooms)
      .set({ name: newName })
      .where(eq(rooms.id, roomId))

    return NextResponse.json({ messages: "Successfully updated the room name" }, { status: 200 })

  } catch (error) {
    console.log("error while updaing the room name\n", error);
    return NextResponse.json({ message: `Error in the server` }, { status: 500 })
  }
}
