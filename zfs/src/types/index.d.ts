interface NavigationItem {
  name: string;
  tag: string;
  current: boolean;
  show: boolean;
}

type NavigationCallback = (item: NavigationItem) => void;

interface StepsNavigationItem {
  name: string;
  id: string;
  tag: string;
  current: boolean;
  status: string;
  show: boolean;
}

type StepNavigationCallback = (item: StepsNavigationItem) => void;