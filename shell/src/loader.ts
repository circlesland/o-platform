import { passport } from "./dapps/o-passport.manifest";
import { banking } from "./dapps/o-banking.manifest";
import { dashboard } from "./dapps/o-dashboard.manifest";
import { homepage } from "./dapps/o-homepage.manifest";
import { marketplace } from "./dapps/o-marketplace.manifest";
import { stats } from "./dapps/o-stats.manifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { friends } from "./dapps/o-contacts.manifest";
import { chat } from "./dapps/o-chat.manifest";
import {coop} from "./dapps/o-coop.manifest";

export const dapps: DappManifest<any>[] = [
  homepage,
  passport,
  banking,
  dashboard,
  marketplace,
  stats,
  chat,
  friends,
  coop
];
