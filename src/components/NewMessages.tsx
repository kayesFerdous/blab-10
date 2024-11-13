"use client";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface NewMessagesProps {
  roomId: string;
  userId: string;
  name: string;
}

interface Message {
  id?: string;
  data?: string;
  from?: string;
}

const client = new Ably.Realtime(
  process.env.ABLY_API_KEY as string
);

function PubSub({ roomId, userId, name }: NewMessagesProps) {
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendToServer = async () => {
    await fetch(`/api/rooms/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, input, roomId, name }),
    });
  };

  const { channel } = useChannel(roomId, "message", (newMessage: Message) => {
    const data = newMessage.data;

    function splitLastWord(str: string) {
      const words = str.split(" ");
      const parsedSenderName = words.pop();
      const parsedNewMessage = words.join(" ").trim();
      return { parsedNewMessage, parsedSenderName };
    }

    const { parsedNewMessage, parsedSenderName } = splitLastWord(
      data as string
    );

    setNewMessages((prevMessages) => [
      ...prevMessages,
      { id: newMessage.id, data: parsedNewMessage, from: parsedSenderName },
    ]);
  });

  const spreadMessage = () => {
    channel.publish("message", input + " " + name);
    setInput("");
    sendToServer();
  };

  return (
    <div>
      <div>
        {newMessages.map((newMessage) => (
          <div key={newMessage.id}>
            <p className="text-xs">{newMessage.from}</p>
            <p> {newMessage.data}</p>
          </div>
        ))}
      </div>
      <Textarea
        value={input}
        onChange={({ target }) => setInput(target.value)}
      />
      <Button onClick={spreadMessage}>Send</Button>
    </div>
  );
}

export default function NewMessages({
  roomId,
  userId,
  name,
}: NewMessagesProps) {
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={roomId}>
        <PubSub roomId={roomId} userId={userId} name={name} />
      </ChannelProvider>
    </AblyProvider>
  );
}
