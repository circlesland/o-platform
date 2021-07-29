export default interface ItemCardContext {
  imageUrl?: string;
  title?: string;
  subTitle?: string;
  truncateMain?: boolean;
  edgeless?: boolean;
  shadow?: boolean;
  action?: () => void;
}
