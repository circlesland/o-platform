import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Erc721Collection from "./o-gallery/pages/Erc721Collection.svelte";

const nfts: Page<any, GalleryDappState> = {
  routeParts: ["=nfts"],
  component: Erc721Collection,
  title: "NFTs",
  icon: "assets",
  type: "page",
};

export class GalleryDappState {
}

export const gallery: DappManifest<GalleryDappState> = {
  dappId: "gallery:1",
  type: "dapp",
  isSingleton: true,
  isHidden: false,
  icon: "gallery",
  title: "Gallery",
  routeParts: ["gallery"],
  defaultRoute: ["nfts"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  routables: [nfts],
};
