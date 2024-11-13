import { auth } from "@/auth"
import CreateRoom from "@/components/CreateRoom"

export default async function Rooms() {
  const session = await auth();
  const userId = session?.user?.id
  return (
    <div>
      <CreateRoom userId={userId} />
    </div>
  )
}
