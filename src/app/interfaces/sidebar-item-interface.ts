export interface SidebarItemInterface {
  title: string;
  icon?: string;
  link?: string;
  isAllowed?: boolean;
  children?: SidebarItemInterface[];
}
