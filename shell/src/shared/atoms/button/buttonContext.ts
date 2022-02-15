export default interface ButtonContext {
  label: string;
  color: string; // primary | light
  style?: string; // block | square
  action?: () => Promise<void>;
}
