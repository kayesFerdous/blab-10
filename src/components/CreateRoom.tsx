"use client"

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CreateRoom({ userId }: { userId: string }) {
  const [roomName, setRoomName] = useState("");

  const handeCreateRoom = async () => {
    setRoomName("");

    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Connection-Type": "application/json"
      },
      body: JSON.stringify({ userId, roomName })
    })

    const { alreadyCreated } = await response.json();

    if (alreadyCreated) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "You have already created a room.\nYou can't create more than one room",
      })
    } else {
      toast({
        title: "Success",
        description: "Successfully creaeted new room: " + roomName,
      })
    }
  }
  return (<div>
    <form action={handeCreateRoom}>
      <Input type="text" value={roomName} onChange={({ target }) => setRoomName(target.value)} />
      <Button type="submit">Create Room</Button>
    </form>
  </div>)
}
