
export const JoinRequestStatus = {
  SUCCESS: "success",
  NOT_FOUND: "not_found",
  ALREADY_REQUESTED: "already_requested",
  MORE_THAN_THREE_ROOMS: "more_than_three_rooms",
  ALREADY_MEMBER: "already_member",
  ERROR: "error",
  UNAUTHORIZED: "unauthorized",
} as const;

export type JoinRequestStatusType = typeof JoinRequestStatus[keyof typeof JoinRequestStatus];
