export default interface ButtonContext {
  label: string;
  color: string; // primary | light
  style?: string; // block | square
  loading?: boolean;
  done?: boolean;
  error?: boolean;
  action?: () => Promise<void>;
}
