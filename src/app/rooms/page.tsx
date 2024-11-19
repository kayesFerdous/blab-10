import RoomsList from "@/components/RoomsListComponent";
import { auth } from "@/auth";
import { db } from "@/db";
import { rooms, userRooms } from "@/db/schema";
import { eq, ne } from "drizzle-orm";

export default async function Page() {
  const session = await auth();
  const globalRoomId = process.env.GLOBAL_ROOM_ID!;

  const roomsForUser = await db
    .select({
      id: userRooms.roomId,
      title: rooms.name,
    })
    .from(userRooms)
    .innerJoin(rooms, eq(userRooms.roomId, rooms.id))
    .where(eq(userRooms.userId, session?.user?.id));

  const allRooms = await db
    .select({
      id: rooms.id,
      title: rooms.name
    })
    .from(rooms)
    .where(ne(rooms.id, globalRoomId));

  return (
    <div className="bg-black">
      <RoomsList userRooms={roomsForUser} allRooms={allRooms} />
    </div>
  );
}
