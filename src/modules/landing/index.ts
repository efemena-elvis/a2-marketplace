import { IRouteType } from "@/models/route-type";

const landingRoutes: IRouteType[] = [
  {
    path: "/",
    alias: "/home",
    component: () =>
      import(
        /* webpackChunkName: "landing-layout" */ "@/modules/landing/layouts/landing-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(
            /* webpackChunkName: "landing-module" */ "@/modules/landing/pages/home.vue"
          ),
        meta: {
          guest: true,
          title: "Home",
        },
      },
      {
        path: "/pricing",
        name: "Pricing",
        component: () =>
          import(
            /* webpackChunkName: "landing-module" */ "@/modules/landing/pages/pricing.vue"
          ),
        meta: {
          guest: true,
          title: "Pricing",
        },
      },

      {
        path: "/contact",
        name: "Contact",
        component: () =>
          import(
            /* webpackChunkName: "landing-module" */ "@/modules/landing/pages/contact.vue"
          ),
        meta: {
          guest: true,
          title: "Contact",
        },
      },
    ],
  },
];

export default landingRoutes;
