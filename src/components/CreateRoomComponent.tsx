"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";

export default function CreateRoomComponent({ userId }: { userId: string }) {
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/rooms/room-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, roomName }),
      });

      const { alreadyCreated } = await response.json();

      if (alreadyCreated) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "You have already created a room. You can't create more than one room",
        });
      } else {
        toast({
          title: "Success",
          description: `Successfully created new room: ${roomName}`,
        });
        setRoomName("");
      }
    } catch (error) {
      console.error("Error creating a room:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create room. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4 bg-black">
      <div className="w-full max-w-2xl space-y-8 p-12 bg-black text-white border border-white/25 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-center lg:text-6xl">Create Room</h1>
        <p className="text-center text-zinc-400 text-sm">
          You can build only **one room**—not a mansion.
          If you already have a room, take a deep breath and cherish it. This isn’t Minecraft.
        </p>
        <form className="space-y-6" onSubmit={handleCreateRoom}>
          <div>
            <label htmlFor="roomName" className="block text-xl font-medium mb-4 lg:text-2xl">
              Room Name
            </label>
            <Input
              id="roomName"
              name="roomName"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full text-xl bg-black text-white border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-4 text-xl font-medium bg-blue-600 hover:bg-blue-700 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
            disabled={isLoading || !roomName.trim()}
          >
            {isLoading ? "Summoning..." : "Create Room"}
          </Button>
        </form>
      </div>
    </div>
  );
}

