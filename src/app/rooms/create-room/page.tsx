import { auth } from "@/auth"
import CreateRoom from "@/components/CreateRoomComponent"
import { redirect } from "next/navigation";

export default async function Rooms() {
  const session = await auth();

  if (!session?.user) redirect("/login")

  const userId = session?.user?.id
  return (
    <div className="h-full  border-white/15 rounded-md border">
      <CreateRoom userId={userId} />
    </div>
  )
}
