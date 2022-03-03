import {
  EoaData,
  ProfileData,
  RegistrationData,
  SafeData,
  UbiData
} from "./initEvent";
import {ClaimedInvitation, ProfileEvent, SafeInfo, SessionInfo} from "../../../shared/api/data/types";
import {OpenloginUserInfo} from "@toruslabs/openlogin";

export type InitContext = {
  session?: SessionInfo;
  openLoginUserInfo: OpenloginUserInfo;
  registration?: RegistrationData;
  invitation?: ClaimedInvitation;
  profile?: ProfileData;
  eoa?: EoaData;
  eoaInvitationTransaction?: ProfileEvent;
  safe?: SafeData;
  safeInvitationTransaction?: ProfileEvent;
  ubi?: UbiData,
};