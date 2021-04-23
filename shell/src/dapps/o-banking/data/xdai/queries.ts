import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";

export class Queries {
  static async findCirclesTokenOfSafeAddress(safeAddress:string) {
    const foundTokenOrNull = await new CirclesAccount(safeAddress).tryGetMyToken();
    if (!foundTokenOrNull) {
      console.log("The safe isn't yet signed-up at the circles hub")
    }
    return foundTokenOrNull;
  }
}