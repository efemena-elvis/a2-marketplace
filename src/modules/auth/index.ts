import { IRouteType } from "@/models/route-type";

// *********** A2 MARKETPLACE AUTHENTICATED ROUTES *********** //
const authRoutes: IRouteType[] = [
  {
    path: "/login",
    component: () =>
      import(
        /* webpackChunkName: "auth-layout" */ "@/modules/auth/layouts/auth-center-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "Login",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/login.vue"
          ),
        meta: {
          guest: true,
          title: "Login",
        },
      },
      {
        path: "/create-account",
        name: "CreateAccount",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/create-account.vue"
          ),
        meta: {
          guest: true,
          title: "Create Account",
        },
      },
      {
        path: "/verify-account/:user_id",
        name: "VerifyAccount",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/verify-account.vue"
          ),
        meta: {
          guest: true,
          title: "Verify Email",
        },
      },
      {
        path: "/password-request",
        name: "PasswordRequest",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/password-request.vue"
          ),
        meta: {
          guest: true,
          title: "Password Request",
        },
      },
      {
        path: "/password-reset/:token",
        name: "PasswordReset",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/password-reset.vue"
          ),
        meta: {
          guest: true,
          title: "Password Reset",
        },
      },
    ],
  },

  {
    path: "/provider-connect",
    name: "ProviderConnect",
    component: () =>
      import(
        /* webpackChunkName: "base-layout" */ "@/modules/auth/pages/provider-connect.vue"
      ),
    meta: {
      open: true,
      title: "Provider Connect",
      pageMeta: {
        title: "Provider Connect",
        description: "A2 Core Provider Connect",
      },
    },
  },
];

export default authRoutes;
