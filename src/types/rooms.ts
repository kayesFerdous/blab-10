
export const JoinRequestStatus = {
  SUCCESS: "success",
  NOT_FOUND: "not_found",
  ALREADY_REQUESTED: "already_requested",
  ALREADY_MEMBER: "already_member",
  ERROR: "error",
  UNAUTHORIZED: "unauthorized",
} as const;

export type JoinRequestStatusType = typeof JoinRequestStatus[keyof typeof JoinRequestStatus];
