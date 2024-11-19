import { auth } from "@/auth"
import RoomMessages from "@/components/RoomMessageComponent"
import { db } from "@/db"
import { messages } from "@/db/schema"
import { SelectMessages } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function Page({ params }: {
  params: Promise<{ roomId: string, roomTitle: string }>
}) {
  const { roomId, roomTitle } = await params;
  const decodedRoomTitle = decodeURIComponent(roomTitle);
  const session = await auth()
  const userId = session?.user?.id
  const name = session?.user?.name

  const prev_messages: SelectMessages[] = await db
    .select()
    .from(messages)
    .where(eq(messages.roomId, roomId))

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
