import {
  EoaData,
  InvitationData,
  InvitationTransaction,
  ProfileData,
  RegistrationData,
  SafeData,
  UbiData
} from "./initEvent";
import {ClaimedInvitation, InitAggregateState, ProfileEvent, SessionInfo} from "../../../shared/api/data/types";

export type InitContext = {
  session?: SessionInfo;
  registration?: RegistrationData;
  invitation?: ClaimedInvitation;
  profile?: ProfileData;
  eoa?: EoaData;
  eoaInvitationTransaction?: ProfileEvent;
  safe?: SafeData;
  safeInvitationTransaction?: ProfileEvent;
  ubi?: UbiData,
  initAggregateState?: InitAggregateState
};