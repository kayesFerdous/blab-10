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
  const { userId, message, roomId, username } = body;

  await pusher.trigger(roomId, "message", {
    message: message,
    from: username
  });

  const response = await db
    .insert(messages)
    .values({ userId: userId, message: message, roomId: roomId, name: username })

  if (response) {
    return Response.json({ message: "Success fully inserted message" })
  }
}
