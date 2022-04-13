export default interface ButtonContext {
  label: string;
  icon?: string;
  color: string; // primary | light
  style?: string; // block | square
  disableLoading?: Boolean;
  action?: () => Promise<void>;
}
