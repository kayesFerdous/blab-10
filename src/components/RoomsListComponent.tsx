"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Users, Globe } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { JoinRequestStatus } from "@/types/rooms";
import Link from "next/link";
import { useState } from "react";

interface Room {
  id: string;
  title: string;
}

interface RoomListsProps {
  userRooms: Room[];
  allRooms: Room[];
}

export default function RoomLists({ userRooms, allRooms }: RoomListsProps) {
  const [requestingRooms, setRequestingRooms] = useState<Set<string>>(new Set());

  const handleRequestJoin = async (roomId: string) => {
    setRequestingRooms((prev) => new Set(prev).add(roomId));
    try {
      const response = await fetch("/api/rooms/room-join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomId }),
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

        case JoinRequestStatus.MORE_THAN_THREE_ROOMS:
          toast({
            variant: "destructive",
            title: "Failed",
            description: "You can't join more than 3 rooms",
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
      setRequestingRooms((prev) => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    }
  };

  return (
    <div className="h-full min-h-[100dvh] w-full max-w-full overflow-hidden sm:h-[calc(100vh-1rem)] p-2 border-white/15 border rounded-lg flex flex-col bg-black">
      <div className="sticky top-0 bg-black z-10 w-full">
        <div className="max-w-4xl w-full mx-auto flex items-center px-2 sm:px-6 py-4 border-b border-white/15">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Rooms</h1>
        </div>
      </div>

      <ScrollArea className="flex-grow w-full">
        <div className="max-w-4xl w-full mx-auto py-6 space-y-6 px-2 sm:px-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Welcome to Blab Rooms!</AlertTitle>
            <AlertDescription>
              Here you can view your joined rooms and discover new ones. Remember, you can join up to 3 rooms at a time.
            </AlertDescription>
          </Alert>

          {/* Your Rooms Section */}
          <Card className="bg-zinc-900 border-zinc-800 w-full">
            <CardHeader className="px-3 sm:px-6 border-b border-white/15">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Your Rooms
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 py-4">
              <ScrollArea className="h-[200px] w-full">
                <div className="space-y-4 pr-4">
                  {userRooms.length === 0 ? (
                    <p className="text-zinc-400 text-center py-4">
                      You haven&apos;t joined any rooms yet. Explore the &apos;All Rooms&apos; section below to find interesting conversations!
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {userRooms.map((room) => (
                        <li key={room.id}>
                          <Link href={`/rooms/${room.id}/${encodeURIComponent(room.title)}`}>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-zinc-700 hover:bg-zinc-600 text-white border-black"
                            >
                              <span className="truncate">{room.title}</span>
                            </Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* All Rooms Section */}
          <Card className="bg-zinc-900 border-zinc-800 w-full">
            <CardHeader className="px-3 sm:px-6 border-b border-white/15">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <Globe className="mr-2 h-6 w-6" />
                All Rooms
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 py-4">
              <p className="text-zinc-400 mb-4">
                Discover new rooms and request to join interesting conversations. Remember, you can be a member of up to 3 rooms at a time.
              </p>
              <ScrollArea className="h-[200px] w-full">
                <div className="space-y-4 pr-4">
                  {allRooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex items-center gap-2 py-2 bg-zinc-800 px-3 rounded-md"
                    >
                      <span className="flex-grow truncate text-white text-sm">
                        {room.title}
                      </span>
                      {!userRooms.some((userRoom) => userRoom.id === room.id) ? (
                        <Button
                          size="sm"
                          onClick={() => handleRequestJoin(room.id)}
                          disabled={requestingRooms.has(room.id)}
                          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] transition-all duration-300"
                        >
                          {requestingRooms.has(room.id) ? "Requesting..." : "Request to Join"}
                        </Button>
                      ) : (
                        <span className="text-green-500 text-sm">Joined</span>
                      )}
                    </li>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}


