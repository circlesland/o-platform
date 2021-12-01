import {BN} from "ethereumjs-util";
import {ClaimedInvitation, ProfileEvent, SessionInfo} from "../../../shared/api/data/types";

export type Origin = "Created" | "Imported";

export type RegistrationData = {
  profileId: number;
  email: string;
  acceptedToSVersion: string;
  subscribedToNewsletter: boolean;
  circlesSafeOwner: string;
}

export type InvitationData = {
  id: string
  createdByProfileId: number
  createdAt: string,
  redeemedAt?: string,
  redeemedTo?: string
}

export type InvitationTransaction = {
  txHash: string
  value: BN
}

export type ProfileData = {
  id: number;
  firstName: string;
  lastName?: string;
  cityId: number;
  passion?: string;
  avatarUrl?: string;
  circlesSafeOwner?: string;
}

export type EoaData = {
  privateKey: string;
  address: string;
  origin: Origin;
  balance: BN;
}

export type SafeData = {
  address: string;
  origin: Origin;
  balance?: BN;
}

export type UbiData = {
  tokenAddress: string;
}

export type InitEvent = {
  type: "COMPLETE"
} | {
  type: "CANCEL"
} | {
  type: "NO_SESSION"
} | {
  type: "GOT_SESSION",
  session: SessionInfo
} | {
  type: "NO_REGISTRATION"
} | {
  type: "GOT_REGISTRATION",
  registration: RegistrationData
} | {
  type: "NO_INVITATION"
} | {
  type: "NO_INVITATION_NECESSARY"
} | {
  type: "GOT_INVITATION",
  invitation: ClaimedInvitation
} | {
  type: "NO_PROFILE"
} | {
  type: "GOT_PROFILE",
  profile: ProfileData
} | {
  type: "NO_EOA"
} | {
  type: "LOCKED_EOA"
} | {
  type: "GOT_EOA",
  eoa: EoaData
} | {
  type: "NOT_REDEEMED"
} | {
  type: "GOT_REDEEMED",
  transaction: ProfileEvent
} | {
  type: "NO_SAFE"
} | {
  type: "GOT_SAFE",
  safe: SafeData
} | {
  type: "NO_UBI"
} | {
  type: "GOT_UBI",
  ubi: UbiData
} | {
  type: "UBI_ERROR"
} | {
  type: "LOGGED_IN"
} | {
  type: "CANCELLED"
} | {
  type: "REGISTERED"
} | {
  type: "GOT_INVITED"
} | {
  type: "PROFILE_CREATED"
} | {
  type: "INVITATION_USED"
} | {
  type: "INVITATION_UNUSED"
} | {
  type: "EOA_CREATED"
} | {
  type: "EOA_CONNECTED"
} | {
  type: "REDEEMED"
} | {
  type: "SAFE_CONNECTED"
} | {
  type: "SAFE_CREATED"
} | {
  type: "FUNDED"
} | {
  type: "REGISTRATION_ERROR",
  error: Error
} | {
  type: "INVITATION_ERROR",
  error: Error
} | {
  type: "PROFILE_ERROR",
  error: Error
} | {
  type: "EOA_ERROR",
  error: Error
} | {
  type: "SAFE_ERROR",
  error: Error
}