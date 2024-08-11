import { DropdownList } from './dropdown';

export type SidebarList = {
  label: string;
  icon: string;
  href?: string;
  isActive?: boolean;
  isDropdown?: boolean;
  dropdownList?: DropdownList[];
};
