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
        path: "/create-password",
        name: "CreatePassword",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/create-password.vue"
          ),
        meta: {
          guest: true,
          title: "Create Password",
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
    path: "/select-provider",
    name: "SelectProvider",
    component: () =>
      import(
        /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/select-provider.vue"
      ),
    meta: {
      guest: true,
      title: "Select a Provider",
    },
  },
];

export default authRoutes;
