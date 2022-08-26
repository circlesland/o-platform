import {
  EoaData,
  ProfileData,
  RegistrationData,
  SafeData,
  UbiData
} from "./initEvent";
import {ClaimedInvitation, Profile, ProfileEvent, SafeInfo, SessionInfo} from "../../../shared/api/data/types";
import {OpenloginUserInfo} from "@toruslabs/openlogin";

export type InitContext = {
  localStorageSchemaVersion: 1,
  useMockProfileIndex?: number;
  session?: SessionInfo;
  openLoginUserInfo: OpenloginUserInfo;
  registration?: RegistrationData;
  invitation?: ClaimedInvitation;
  profile?: Profile;
  eoa?: EoaData;
  eoaInvitationTransaction?: ProfileEvent;
  safe?: SafeData;
  ubi?: UbiData,
};