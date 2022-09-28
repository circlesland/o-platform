export interface NavigationProps {
  icon?: string;
  text?: string;
  backgroundColorClass?: string;
  action?: () => void;
}

export interface NavigationElement {
  isActive?: boolean;
  isVisible?: boolean;
  component: any;
  props: NavigationProps;
}

export interface NavigationManifest {
  leftSlot?: NavigationElement;
  rightSlot?: NavigationElement;
  navPill?: {
    left?: NavigationElement;
    right?: NavigationElement;
    center?: NavigationElement;
  };
  loginPill?: NavigationElement;
}
