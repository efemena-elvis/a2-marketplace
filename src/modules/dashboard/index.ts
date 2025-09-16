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
            description: "A2 Marketplace Dashboard",
          },
        },
      },

      // {
      //   path: "/notifications",
      //   name: "RedstoneNotifications",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/notifications.vue"
      //     ),
      //   meta: {
      //     requiresAuth: true,
      //     title: "Notifications",
      //     pageMeta: {
      //       title: "Merchant transactions",
      //       description: "View all merchant transactions",
      //     },
      //   },
      // },

      // {
      //   path: "/activity-logs",
      //   name: "RedstoneActivityLogs",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/activity-logs.vue"
      //     ),
      //   meta: {
      //     requiresAuth: true,
      //     title: "Activity Logs",
      //     pageMeta: {
      //       title: "Merchant Activity Logs",
      //       description:
      //         "View all transaction activities initiated on your account",
      //     },
      //   },
      // },
    ],
  },
];

export default dashboardRoutes;
