"use client"

import { useState } from "react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { JoinRequestStatus } from "@/types/rooms"

interface Room {
  id: string
  title: string
}

interface RoomListsProps {
  userRooms: Room[]
  allRooms: Room[]
}

export default function RoomLists({ userRooms, allRooms }: RoomListsProps) {
  const [requestingRooms, setRequestingRooms] = useState<Set<string>>(new Set())

  const handleRequestJoin = async (roomId: string) => {
    setRequestingRooms(prev => new Set(prev).add(roomId))
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
      console.error("Error joining room:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join the room. Please try again.",
      });
    } finally {
      setRequestingRooms(prev => {
        const newSet = new Set(prev)
        newSet.delete(roomId)
        return newSet
      })
    }
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.2))] sm:h-[calc(100vh-theme(spacing.4))] p-2 border-white/15 border rounded-lg flex flex-col bg-black">
      <div className="sticky top-0 bg-black z-10">
        <div className="max-w-4xl mx-auto flex items-center px-4 sm:px-6 py-4 border-b border-white/15">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Rooms</h1>
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="max-w-4xl mx-auto py-6 space-y-6 px-4 sm:px-6">
          {/* Your Rooms Section */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="px-4 sm:px-6 border-b border-white/15">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white">Your Rooms</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 py-4">
              <ScrollArea className="h-[200px] -mx-4 sm:-mx-6">
                <div className="space-y-4 px-4 sm:px-6 pb-6">
                  {userRooms.length === 0 ? (
                    <p className="text-zinc-400 text-center py-4">You haven&apos;t joined any rooms yet.</p>
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
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="px-4 sm:px-6 border-b border-white/15">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white">All Rooms</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 py-4">
              <ScrollArea className="h-[200px] -mx-4 sm:-mx-6">
                <div className="space-y-4 px-4 sm:px-6 pb-6">
                  {allRooms.map((room) => (
                    <li key={room.id} className="flex items-center gap-3 py-2 bg-zinc-800 px-3 rounded-md">
                      <span className="flex-grow truncate text-white text-sm">{room.title}</span>
                      {!userRooms.some(userRoom => userRoom.id === room.id) && (
                        <Button
                          size="sm"
                          onClick={() => handleRequestJoin(room.id)}
                          disabled={requestingRooms.has(room.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] transition-all duration-300"
                        >
                          {requestingRooms.has(room.id) ? "Requesting..." : "Request to Join"}
                        </Button>
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
  )
}
