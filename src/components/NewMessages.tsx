"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { pusherClient } from "@/lib/pusher";

interface NewMessagesProps {
  roomId: string;
  userId: string;
  name: string;
}

interface Message {
  message?: string;
  from?: string;
}

export default function NewMessage({ roomId, userId, name }: NewMessagesProps) {
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");


  useEffect(() => {
    const channel = pusherClient.subscribe(roomId);

    channel.bind("message", (data: Message) => {
      setNewMessages((prevMessages) => [
        ...prevMessages, data
      ])
    });

    return () => {
      pusherClient.unsubscribe(roomId)
    };
  }, [roomId])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`/api/rooms/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, message: input, roomId, username: name }),
    });

    setInput("");
  }

  return (
    <div>
      <div>
        {newMessages.map((newMessage, index) => (
          <div key={index}>
            <p className="text-xs">{newMessage.from}</p>
            <p> {newMessage.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>

        <Textarea
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

