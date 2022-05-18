import { passport } from "./dapps/o-passport.manifest";
import { banking } from "./dapps/o-banking.manifest";
import { home } from "./dapps/o-dashboard.manifest";
import { events } from "./dapps/o-events.manifest";
import { homepage } from "./dapps/o-homepage.manifest";
import { marketplace } from "./dapps/o-marketplace.manifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { contacts } from "./dapps/o-contacts.manifest";
import { coop } from "./dapps/o-coop.manifest";
import { verification } from "./dapps/o-verification.manifest";
import {welcome} from "./dapps/o-welcome.manifest";
import {gallery} from "./dapps/o-gallery.manifest";

export const dapps: DappManifest<any>[] = [
  homepage,
  passport,
  banking,
  home,
  events,
  marketplace,
  contacts,
  coop,
  verification,
  welcome,
  gallery
];
