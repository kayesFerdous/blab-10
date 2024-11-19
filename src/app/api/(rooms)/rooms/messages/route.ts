import { db } from "@/db";
import { messages } from "@/db/schema";
import { NextRequest } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, message, roomId, name } = body;

  try {
    const newMessage = await db
      .insert(messages)
      .values({
        userId,
        message,
        roomId,
        name
      })
      .returning();

    const messageData = newMessage[0];

    await pusher.trigger(roomId, "new-message", messageData);

    return Response.json(messageData);
  } catch (error) {
    console.error('Failed to save message:', error);
    return Response.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
