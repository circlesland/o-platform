export interface NavigationManifest {
  leftSlot?: {
    component: any;
    props: {
      icon: string;
      action: string;
    };
  };
  rightSlot?: {
    component: any;
    props: {
      icon: string;
    };
  };
  navPill?: {
    left?: {
      component: any;
      props: {
        icon: string;
        action: string;
      };
    };
    right?: {
      component: any;
      props: {
        icon: string;
        action: string;
        link: string;
      };
    };
    actionButton: {
      component: any;
      props: {
        disabled: boolean;
      };
    };
  };
  loginPill?: {
    isOpen: false;
    actionButton: {
      component: any;
      props: {
        disabled: false;
      };
    };
  };
}
