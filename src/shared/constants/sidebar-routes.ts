import { ISidebarRouteType, ISideNavType } from "../../models/route-type";

export const sidebarRoutes: ISidebarRouteType = {
  home: [
    // {
    //   slug: "overview",
    //   link: "/overview",
    //   title: "Overview",
    //   icon: "icon-home",
    //   active: true,
    // },
    {
      slug: "compliance",
      link: "/compliance/documents",
      title: "Compliance",
      icon: "icon-shield-tick",
      active: true,
    },
  ],

  payments: [
    {
      link: "/transfers/balance",
      title: "Balance",
      icon: "icon-empty-wallet",
      active: true,
    },
    {
      link: "/payments/transactions",
      title: "Transactions",
      icon: "icon-card-transaction",
      active: true,
    },
    {
      link: "/payments/customers",
      title: "Customers",
      icon: "icon-profile-users",
      active: true,
    },
    // {
    //   link: "/payments/refunds",
    //   title: "Refunds",
    //   icon: "icon-rotate-left",
    //   active: true,
    // },
    {
      link: "/payments/payouts",
      title: "Payouts",
      icon: "icon-export",
      active: true,
    },
    // {
    //   link: "/payments/disputes",
    //   title: "Disputes",
    //   icon: "icon-flag",
    //   active: true,
    // },
    // {
    //   link: "/",
    //   title: "Subaccounts",
    //   icon: "icon-layer",
    //   active: true,
    // },
  ],

  transfers: [
    // {
    //   link: "/transfers/all-transfers",
    //   title: "Transfers",
    //   icon: "icon-transfer-top-right",
    //   active: true,
    // },
    // {
    //   link: "/transfers/recipients",
    //   title: "Recipients",
    //   icon: "icon-profile-users",
    //   active: true,
    // },
    // {
    //   link: "/transfers/balance",
    //   title: "Balance",
    //   icon: "icon-empty-wallet",
    //   active: true,
    // },
  ],

  commerce: [
    {
      link: "/storefront",
      title: "Storefront",
      icon: "icon-shopping-cart",
      active: true,
    },
    // {
    //   link: "/",
    //   title: "Payment links",
    //   icon: "icon-transfer-top-right",
    //   active: true,
    // },
    // {
    //   link: "/",
    //   title: "Orders",
    //   icon: "icon-profile-users",
    //   active: true,
    // },
    // {
    //   link: "/",
    //   title: "Invoice",
    //   icon: "icon-card-receive",
    //   active: true,
    // },
  ],

  settings: [
    {
      link: "/activity-logs",
      title: "Activity logs",
      icon: "icon-chart",
      active: true,
    },
    {
      link: "/settings/profile",
      title: "Settings",
      icon: "icon-cog",
      active: true,
    },
  ],
};

export const complianceSidebarRoutes: ISideNavType[] = [
  {
    routeTitle: "Documents",
    routeIcon: "icon-file",
    routeLinkName: "RedstoneDocuments",
  },
  {
    routeTitle: "Business",
    routeIcon: "icon-building",
    routeLinkName: "RedstoneBusinessProfile",
  },
  {
    routeTitle: "Registration",
    routeIcon: "icon-shop",
    routeLinkName: "RedstoneRegistrationInformation",
  },
  {
    routeTitle: "Representative",
    routeIcon: "icon-profile-users",
    routeLinkName: "RedstoneRepresentativeProfile",
  },
  {
    routeTitle: "Bank Account",
    routeIcon: "icon-bank",
    routeLinkName: "RedstoneBankAccount",
  },
  {
    routeTitle: "Business Signatory",
    routeIcon: "icon-user",
    routeLinkName: "RedstoneSignatoryProfile",
  },
  {
    routeTitle: "Terms & Agreement",
    routeIcon: "icon-document-text",
    routeLinkName: "RedstoneAgreementSignature",
  },
  {
    routeTitle: "Summary",
    routeIcon: "icon-directbox-notif",
    routeLinkName: "RedstoneComplianceSummary",
  },
];

export const settingsSidebarRoutes: ISideNavType[] = [
  {
    routeTitle: "My Profile",
    routeIcon: "icon-user",
    routeLinkName: "RedstoneProfileSettings",
  },
  {
    routeTitle: "Password",
    routeIcon: "icon-security-safe",
    routeLinkName: "RedstonePasswordSettings",
  },
  // {
  //   routeTitle: "Preferences",
  //   routeIcon: "icon-tool",
  //   routeLinkName: "RedstonePreferenceSettings",
  // },
  {
    routeTitle: "Contacts",
    routeIcon: "icon-profile-users",
    routeLinkName: "RedstoneContactSettings",
  },
  {
    routeTitle: "Bank Account",
    routeIcon: "icon-bank",
    routeLinkName: "RedstoneAccountSettings",
  },
  {
    routeTitle: "Developers",
    routeIcon: "icon-developer",
    routeLinkName: "RedstoneDeveloperSettings",
  },
];
