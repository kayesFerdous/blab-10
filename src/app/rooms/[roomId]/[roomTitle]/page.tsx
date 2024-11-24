import { auth } from "@/auth"
import RoomMessages from "@/components/RoomMessageComponent"
import { db } from "@/db"
import { messages, SelectUserRooms, userRooms } from "@/db/schema"
import { SelectMessages } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function Page({ params }: {
  params: Promise<{ roomId: string, roomTitle: string }>
}) {
  const session = await auth()
  const user = session?.user;

  if (!user) return redirect(`/login/rooms/`);

  const { roomId, roomTitle } = await params;
  const decodedRoomTitle = decodeURIComponent(roomTitle);
  const userId = user?.id
  const name = user?.name

  const response: SelectUserRooms[] = await db
    .select()
    .from(userRooms)
    .where(and(
      eq(userRooms.userId, userId),
      eq(userRooms.roomId, roomId)
    ));

  if (!response[0]?.roomId) {
    redirect("/rooms")
  }

  const prev_messages: SelectMessages[] = await db
    .select()
    .from(messages)
    .where(eq(messages.roomId, roomId))

  console.log("previous messages: \n", prev_messages);

  return (
    <div className="sm:h-[calc(100vh-20px)] h-[calc(100vh-9px)] bg-black border border-white/15 rounded-md">
      <RoomMessages
        roomId={roomId}
        roomTitle={decodedRoomTitle}
        userId={userId}
        name={name}
        initialMessages={prev_messages}
      />
    </div>
  )
}
