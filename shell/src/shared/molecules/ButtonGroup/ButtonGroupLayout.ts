import { UserActionItem } from "../../userActions";

export default interface ButtonGroupLayout {
  orientation: "stack" | "inline";
  labels: {
    [x: string]: LabelOverride;
  };
  colors: {
    default: string;
    overrides?: ColorOption;
  };
}

export type LabelOverride = string | ((action: UserActionItem) => string);

export type ColorOption = string | ((action: UserActionItem) => string | null);

export interface ColorOptions {
  [x: string]: ColorOption;
}
