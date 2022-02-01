import ButtonContext from "../atoms/button/buttonContext";

export default interface ButtonGroupContext {
  style?: string; // stack | inline
  buttons: ButtonContext[];
}
