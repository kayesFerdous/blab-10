import { auth } from "@/auth";
import { JoinRoomComponent } from "@/components/JoinRoomComponent";
import { redirect } from "next/navigation";

export default async function JoinRoom() {
  const session = await auth();
  if (!session?.user) redirect("/login/rooms/join-room");
  return (
    <div className="h-full border-white/15 rounded-md">
      <JoinRoomComponent />
    </div>
  );
}
