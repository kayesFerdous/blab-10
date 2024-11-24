import { auth } from "@/auth";
import { db } from "@/db";
import { rooms, users, pendingRequests, userRooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import RoomSettings from "@/components/RoomSettingsComponent";

export interface PendingRequestsUserInfo {
  userId?: string;
  name?: string;
}
export interface UserInfo {
  userId?: string
  name?: string | null
}

export default async function Page({ params }: { params: Promise<{ roomId: string }> }) {
  const session = await auth();

  if (!session?.user) redirect("/login/rooms")

  const userId = session?.user?.id;

  const { roomId } = await params;

  if (!userId) {
    return <div>Please log in to view room settings.</div>;
  }

  const room = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);

  if (!room || room.length === 0) {
    notFound();
  }

  const isCreator = room[0].createdBy === userId;
  const roomCreatorId = room[0].createdBy;
  let initialPendingRequests: PendingRequestsUserInfo[] = [];

  const roomUsersList: UserInfo[] = await db
    .select({
      userId: userRooms.userId,
      name: users.name,
    })
    .from(userRooms)
    .innerJoin(users, eq(userRooms.userId, users.id))
    .where(eq(userRooms.roomId, roomId));

  if (isCreator) {
    initialPendingRequests = await db
      .select({
        userId: pendingRequests.userId,
        name: users.name,
      })
      .from(pendingRequests)
      .innerJoin(users, eq(pendingRequests.userId, users.id))
      .where(eq(pendingRequests.roomId, roomId))
      .then((results) =>
        results.map((request) => ({
          userId: request.userId,
          name: request.name ?? undefined,
        }))
      );
  }

  return (
    <RoomSettings
      roomId={roomId}
      currentUserId={userId}
      roomCreatorId={roomCreatorId}
      initialRoomTitle={room[0].name}
      isCreator={isCreator}
      initialroomUsersList={roomUsersList}
      initialPendingRequests={initialPendingRequests}
    />
  );
}

