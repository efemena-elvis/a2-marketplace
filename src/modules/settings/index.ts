import { IRouteType } from "@/models/route-type";

const settingsRoutes: IRouteType[] = [
  {
    path: "/settings",
    component: () =>
      import(
        /* webpackChunkName: "base-layout" */ "@/modules/dashboard/layouts/dashboard-layout.vue"
      ),
    children: [
      {
        path: "",
        component: () =>
          import("@/modules/settings/layouts/settings-layout.vue"),
        children: [
          {
            path: "profile",
            name: "SettingsProfile",
            component: () => import("@/modules/settings/pages/profile.vue"),
            meta: {
              requiresAuth: true,
              title: "Profile",
              pageMeta: {
                title: "Profile",
                description: "A2 Core Settings Profile",
              },
            },
          },
          {
            path: "contact-information",
            name: "SettingsContact",
            component: () =>
              import("@/modules/settings/pages/contact-information.vue"),
            meta: {
              requiresAuth: true,
              title: "Contact Information",
              pageMeta: {
                title: "Contact Information",
                description: "A2 Core Settings Contact Information",
              },
            },
          },
          {
            path: "security",
            name: "SettingsSecurity",
            component: () => import("@/modules/settings/pages/security.vue"),
            meta: {
              requiresAuth: true,
              title: "Security",
              pageMeta: {
                title: "Security",
                description: "A2 Core Settings Security",
              },
            },
          },
          {
            path: "providers",
            name: "SettingsProviders",
            component: () => import("@/modules/settings/pages/providers.vue"),
            meta: {
              requiresAuth: true,
              title: "Providers",
              pageMeta: {
                title: "Providers",
                description: "A2 Core Settings Providers",
              },
            },
          },
        ],
      },
    ],
  },
];

export default settingsRoutes;
