interface NavigationItem {
  name: string;
  tag: string;
  current: boolean;
  show: boolean;
}

type NavigationCallback = (item: NavigationItem) => void;