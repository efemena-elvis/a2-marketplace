import { useStorage } from "@/shared/composables/useStorage";
import { useString } from "@/shared/composables/useString";
import constants from "@/utilities/constants";
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

const { getStorage } = useStorage();
const { logOutUser, checkAuthTimeout } = useString();

class RouteGuard {
  sessionTime: number = 90;
  loginRoute: string = "RedstoneLogin";
  dashboardRoute: string = "RedstoneBalance"; // "RedstoneOverview";

  authToken: string | object | null = getStorage({
    storage_name: constants.REDSTONE_AUTH_TOKEN,
  });

  verifyAuthRoutes(
    to: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    if (this.authToken === null) {
      next({
        name: this.loginRoute,
      });
    } else {
      this.checkUserTimeoutSession(next);
    }
  }

  verifyGuestRoutes(
    to: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    if (this.authToken === null) {
      next();
    } else {
      this.checkUserTimeoutSession(next, true);
    }
  }

  checkUserTimeoutSession(
    next: NavigationGuardNext,
    is_guest: boolean = false
  ): void {
    const is_timed_out: boolean = checkAuthTimeout(this.sessionTime);

    if (is_timed_out) {
      logOutUser();
    } else {
      is_guest ? next({ name: this.dashboardRoute }) : next();
    }
  }
}

export default new RouteGuard();
