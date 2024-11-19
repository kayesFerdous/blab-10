"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { JoinRequestStatus } from "@/types/rooms";

export function JoinRoomComponent() {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/rooms/room-join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomCode }),
      });

      const { result } = await response.json();

      switch (result) {
        case JoinRequestStatus.SUCCESS:
          toast({
            variant: "default",
            title: "Success",
            description: "Request has been made.\nWait for the room creator's approval",
          });
          break;

        case JoinRequestStatus.ALREADY_REQUESTED:
          toast({
            variant: "destructive",
            title: "Failed",
            description: "You have already requested to join this room",
          });
          break;

        case JoinRequestStatus.ALREADY_MEMBER:
          toast({
            variant: "destructive",
            title: "Failed",
            description: "You are already a member of this room",
          });
          break;

        case JoinRequestStatus.NOT_FOUND:
          toast({
            variant: "destructive",
            title: "Failed",
            description: "Room not found",
          });
          break;

        case JoinRequestStatus.ERROR:
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while trying to join the room",
          });
          break;

        default:
          toast({
            variant: "destructive",
            title: "Unknown Error",
            description: "An unexpected error occurred",
          });
          break;
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join the room. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4 bg-black">
      <div className="w-full max-w-2xl space-y-8 p-12 bg-black text-white border border-white/25 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-center lg:text-6xl">Join Room</h1>
        <form className="space-y-6" onSubmit={handleJoinRoom}>
          <div>
            <label htmlFor="roomCode" className="block text-xl font-medium mb-4 lg:text-2xl">
              Room Code
            </label>
            <Input
              id="roomCode"
              name="roomCode"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full text-xl bg-black text-white border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-4 text-xl font-medium bg-blue-600 hover:bg-blue-700 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
            disabled={isLoading || !roomCode.trim()}
          >
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </div>
    </div>
  );
}

