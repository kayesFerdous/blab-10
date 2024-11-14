import { auth } from "@/auth";
import NewMessages from "@/components/NewMessages";
import ShowMessages from "@/components/ShowMessages";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { SelectMessages } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({ params }: {
  params: Promise<{ roomId: string }>
}
) {
  const roomId = (await params).roomId;

  const session = await auth();
  const userId = session?.user?.id;
  const name = session?.user?.name;

  const prev_messages: SelectMessages[] = await db
    .select()
    .from(messages)
    .where(eq(messages.roomId, roomId));

  return (
    <div>
      <ShowMessages messageList={prev_messages} />
      <NewMessages roomId={roomId} userId={userId} name={name} />
    </div>
  )
} 
