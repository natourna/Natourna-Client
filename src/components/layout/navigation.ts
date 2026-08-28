import type { ComponentType } from "react";
import {
  ApartmentsIcon,
  BillsIcon,
  HomeIcon,
  PaymentsIcon,
  PeopleIcon,
  WalletIcon,
  type IconProps,
} from "../ui/Icons";

export interface NavItem {
  to: string;
  label: string;
  shortLabel?: string;
  icon: ComponentType<IconProps>;
  end?: boolean;
}

export const adminTabItems: NavItem[] = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/apartments", label: "Apartments", icon: ApartmentsIcon },
  { to: "/payments", label: "Payments", icon: PaymentsIcon },
  { to: "/bills", label: "Bills", icon: BillsIcon },
  { to: "/funds", label: "Funds", icon: WalletIcon },
];

export const adminSidebarItems: NavItem[] = [
  ...adminTabItems,
  { to: "/people", label: "People", icon: PeopleIcon },
];

export const residentNavItems: NavItem[] = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/payments", label: "My payments", icon: PaymentsIcon },
  { to: "/building", label: "Building money", shortLabel: "Building", icon: WalletIcon },
];
