export interface DropdownItem {
  id: string;
  name: string;
  onSelect: () => void;
  color?: string;
}

export interface DropdownProps {
  items: DropdownItem[];
}
