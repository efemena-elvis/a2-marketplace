import { createRouter, createWebHistory } from "vue-router";
import middlewares from "@/middlewares";

// IMPORTED ROUTES FROM RESPECTIVE APPLICATION MODULES
import authRoutes from "@/modules/auth";
import landingRoutes from "@/modules/landing";
import dashboardRoutes from "@/modules/dashboard";

const routes = [
  ...authRoutes,
  ...landingRoutes,
  ...dashboardRoutes,
  {
    path: "/*",
    name: "NotFoundError",
    component: () =>
      import(
        /* webpackChunkName: "errorRoute" */
        "@/modules/error/pages/not-found.vue"
      ),
    meta: {
      guest: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// =============================================================
// WRAPPING OUR APPLICATION ENTRY POINTS INSIDE OUR MIDDLEWARE
// TO VERIFY A USER AUTHENTICATION STATE AND AUTHORIZATION
// =============================================================
// router.beforeEach(async (to, from, next) => middlewares(to, from, next));
export default router;
