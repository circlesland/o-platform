import { passport } from "./dapps/o-passport.manifest";
import { banking } from "./dapps/o-banking.manifest";
import { dashboard } from "./dapps/o-dashboard.manifest";
import { homepage } from "./dapps/o-homepage.manifest";
import { fullnode } from "./dapps/o-miva.manifest";
import { marketplace } from "./dapps/o-marketplace.manifest";
import { trustnetwork } from "./dapps/o-trustnetwork.manifest";
import { stats } from "./dapps/o-stats.manifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { contacts } from "./dapps/o-contacts.manifest";

export const dapps: DappManifest<any>[] = [fullnode];
