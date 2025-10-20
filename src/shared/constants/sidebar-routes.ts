import { IRouteGroupType } from "../../models/route-type";

export const sidebarRoutes: IRouteGroupType[] = [
  {
    slug: "dashboard",
    link: "/dashboard",
    title: "Dashboard",
    icon: "icon-four-square",
    active: true,
  },
  {
    slug: "invoice-irn",
    link: "/invoice-irn",
    title: "Invoice (IRNs)",
    icon: "icon-directbox-notif",
    active: false,
  },
  {
    slug: "invoice-compliance",
    link: "/invoice-compliance/valid",
    title: "Invoice Compliance",
    icon: "icon-shield-tick",
    active: false,
  },
  {
    slug: "invoice-tracker",
    link: "/invoice-tracker",
    title: "Invoice Tracker",
    icon: "icon-radar",
    active: false,
  },
  {
    slug: "activity-logs",
    link: "/activity-logs",
    title: "Activity Logs",
    icon: "icon-note",
    active: false,
  },
  {
    slug: "settings",
    link: "/settings/profile",
    title: "Settings",
    icon: "icon-cog",
    active: false,
  },
];
