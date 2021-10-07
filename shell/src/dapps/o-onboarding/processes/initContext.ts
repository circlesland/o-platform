import {SessionInfo} from "../../o-passport/processes/identify/services/getSessionInfo";
import {
  EoaData,
  InvitationData,
  InvitationTransaction,
  ProfileData,
  RegistrationData,
  SafeData,
  UbiData
} from "./initEvent";
import {InitAggregateState} from "../../../shared/api/data/types";

export type InitContext = {
  session?: SessionInfo;
  registration?: RegistrationData;
  invitation?: InvitationData;
  profile?: ProfileData;
  eoa?: EoaData;
  eoaInvitationTransaction?: InvitationTransaction;
  safe?: SafeData;
  safeInvitationTransaction?: InvitationTransaction;
  ubi?: UbiData,
  initAggregateState?: InitAggregateState
};