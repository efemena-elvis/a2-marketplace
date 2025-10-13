import { IRouteType } from "@/models/route-type";

const dashboardRoutes: IRouteType[] = [
  {
    path: "/dashboard",
    component: () =>
      import(
        /* webpackChunkName: "base-layout" */ "@/modules/dashboard/layouts/dashboard-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/dashboard.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Dashboard",
          pageMeta: {
            title: "Dashboard",
            description: "CISL Dashboard",
          },
        },
      },
      {
        path: "/invoice-irn",
        name: "InvoiceIRN",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/invoice-irn.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Invoice IRN",
          pageMeta: {
            title: "Invoice IRN",
            description: "CISL Invoice IRN",
          },
        },
      },
      {
        path: "/invoice-tracker",
        name: "InvoiceTracker",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/invoice-tracker.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Invoice Tracker",
          pageMeta: {
            title: "Invoice Tracker",
            description: "CISL Invoice Tracker",
          },
        },
      },
      {
        path: "/invoice-compliance",
        name: "InvoiceCompliance",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/invoice-compliance.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Invoice Compliance",
          pageMeta: {
            title: "Invoice Compliance",
            description: "CISL Invoice Compliance",
          },
        },
      },
      {
        path: "/activity-logs",
        name: "ActivityLogs",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/activity-logs.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Activity Logs",
          pageMeta: {
            title: "Activity Logs",
            description: "CISL Activity Logs",
          },
        },
      },
      {
        path: "/settings",
        component: () =>
          import("@/modules/dashboard/layouts/settings-layout.vue"),
        children: [
          {
            path: "profile",
            name: "SettingsProfile",
            component: () => import("@/modules/dashboard/pages/profile.vue"),
          },
          {
            path: "contact-information",
            name: "SettingsContact",
            component: () =>
              import("@/modules/dashboard/pages/contact-information.vue"),
          },
          {
            path: "security",
            name: "SettingsSecurity",
            component: () => import("@/modules/dashboard/pages/security.vue"),
          },
          {
            path: "api-keys",
            name: "SettingsApiKeys",
            component: () => import("@/modules/dashboard/pages/api-keys.vue"),
          },
          {
            path: "providers",
            name: "SettingsProviders",
            component: () => import("@/modules/dashboard/pages/providers.vue"),
          },
        ],
      },
    ],
  },
];

export default dashboardRoutes;
