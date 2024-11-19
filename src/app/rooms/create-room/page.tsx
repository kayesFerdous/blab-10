import { auth } from "@/auth"
import CreateRoom from "@/components/CreateRoomComponent"

export default async function Rooms() {
  const session = await auth();
  const userId = session?.user?.id
  return (
    <div className="h-full  border-white/15 rounded-md border">
      <CreateRoom userId={userId} />
    </div>
  )
}
