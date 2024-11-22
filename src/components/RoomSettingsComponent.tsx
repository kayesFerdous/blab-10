"use client";

import { UserInfo } from "@/app/rooms/room-settings/[roomId]/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Check, Crown, Trash2, UserX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoomSettingsProps {
  roomId: string;
  currentUserId: string;
  roomCreatorId: string;
  initialRoomTitle: string;
  isCreator: boolean;
  initialroomUsersList: UserInfo[];
  initialPendingRequests: UserInfo[];
}

export default function RoomSettings({
  roomId,
  currentUserId,
  roomCreatorId,
  initialRoomTitle,
  isCreator,
  initialroomUsersList,
  initialPendingRequests = [],
}: RoomSettingsProps) {
  const [roomTitle, setRoomTitle] = useState(initialRoomTitle);
  const [pendingRequests, setPendingRequests] = useState<UserInfo[]>(
    initialPendingRequests
  );
  const [roomUsersList, setRoomUsersList] =
    useState<UserInfo[]>(initialroomUsersList);
  const [showMemberList, setShowMemberList] = useState(false);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const router = useRouter();

  const handleRoomNameChange = async () => {
    try {
      const response = await fetch(`/api/rooms/room-rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, newName: roomTitle }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Room name updated successfully",
        });
      }
    } catch (error) {
      console.error("Failed to rename room:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update room name",
      });
    }
  };

  const handleRequestAction = async (
    requestUserId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const response = await fetch(`/api/rooms/room-requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId: requestUserId, action }),
      });
      console.log(response);

      if (response.ok) {
        setPendingRequests((prev) =>
          prev.filter((user) => user.userId !== requestUserId)
        );
        if (action === "approve") {
          const approvedUser = pendingRequests.find(
            (user) => user.userId === requestUserId
          );
          if (approvedUser) {
            setRoomUsersList((prev) => [...prev, approvedUser]);
          }
          toast({
            title: "Success",
            description: "User request approved",
          });
        } else {
          toast({
            title: "Rejected",
            description: "User request rejected",
          });
        }
      }
    } catch (error) {
      console.error("Failed to handle request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process user request",
      });
    }
  };

  const handleKickUser = async (kickUserId: string) => {
    if (!isCreator) return;

    try {
      const response = await fetch(`/api/rooms/room-kick`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: kickUserId, roomId }),
      });

      if (response.ok) {
        setRoomUsersList((prev) =>
          prev.filter((user) => user.userId !== kickUserId)
        );
        toast({
          title: "Success",
          description: "User has been kicked from the room",
        });
      }
    } catch (error) {
      console.error("Failed to kick user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to kick user",
      });
    }
  };

  const handleDestroyRoom = async () => {
    try {
      const response = await fetch(`/api/rooms/room-destroy`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId: currentUserId }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Room has been destroyed",
        });
        router.push("/rooms"); // Redirect to rooms list or home page
      }
    } catch (error) {
      console.error("Failed to destroy room:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to destroy room",
      });
    }
  };

  return (
    <div className="sm:h-[calc(100vh-17px)] border border-white/15 rounded-xl h-[calc(100vh-10px)] overflow-y-auto bg-black">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between sticky top-0 bg-black py-2 z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Room Settings
          </h1>
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="text-white bg-gray-800 hover:bg-gray-700 border-gray-600"
          >
            Back
          </Button>
        </div>

        <div className="space-y-6">
          {isCreator && (
            <div className="p-5 px-4">
              <Label
                htmlFor="roomName"
                className="text-lg mb-2 block text-white"
              >
                Room Name
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="roomName"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  onClick={handleRoomNameChange}
                  disabled={roomTitle === initialRoomTitle}
                  className="bg-white text-black hover:bg-gray-200 transition-all duration-300 whitespace-nowrap"
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          {isCreator && (
            <div className="p-5 px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="sm:text-xl  text-md font-semibold text-white">
                  Pending Requests
                </h2>
                <Button
                  onClick={() => setShowPendingRequests(!showPendingRequests)}
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
                >
                  {showPendingRequests ? "Hide" : "Show"} Requests
                </Button>
              </div>
              {showPendingRequests && (
                <ScrollArea className="h-48 border border-gray-700 rounded-md p-4 bg-gray-800">
                  {pendingRequests.length === 0 ? (
                    <p className="text-gray-400">No pending requests</p>
                  ) : (
                    pendingRequests.map((request) => (
                      <div
                        key={request.userId}
                        className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                      >
                        <span className="text-white">{request.name}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              request.userId &&
                              handleRequestAction(request.userId, "approve")
                            }
                            className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              request.userId &&
                              handleRequestAction(request.userId, "reject")
                            }
                            className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              )}
            </div>
          )}

          <div className="p-5 px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="sm:text-xl text-md font-semibold text-white">
                Room Members
              </h2>
              <Button
                onClick={() => setShowMemberList(!showMemberList)}
                variant="outline"
                className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
              >
                <span>{showMemberList ? "Hide" : "Show"} Members</span>
              </Button>
            </div>
            {showMemberList && (
              <ScrollArea className="h-48 border border-gray-700 rounded-md p-4 bg-gray-800">
                <div className="border-b px-3 mb-2 border-white/50">
                  Total Members: {roomUsersList.length}
                </div>
                {roomUsersList.length === 0 ? (
                  <p className="text-gray-400">No members found</p>
                ) : (
                  roomUsersList.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between py-2 px-4 hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white">{user.name}</span>
                        {user.userId === roomCreatorId && (
                          <div className="flex items-center text-yellow-500">
                            <Crown className="h-4 w-4 mr-1" />
                          </div>
                        )}
                      </div>
                      {isCreator && user.userId !== currentUserId && (
                        <Button
                          size="sm"
                          onClick={() =>
                            user.userId && handleKickUser(user.userId)
                          }
                          className="bg-red-600 text-black hover:bg-red-400 transition-all duration-300"
                        >
                          <UserX className="h-4 w-4" />
                          <span className="sr-only">Kick user</span>
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </ScrollArea>
            )}
          </div>

          {isCreator && (
            <div className="p-5 px-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Destroy Room
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the room and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDestroyRoom}>
                      Yes, destroy room
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
