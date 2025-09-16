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
    slug: "validation",
    link: "/validation",
    title: "Validation",
    icon: "icon-shield-tick",
    active: false,
  },
  {
    slug: "invoices",
    link: "/invoices",
    title: "Invoices (IRNs)",
    icon: "icon-document-text",
    active: false,
  },
];
