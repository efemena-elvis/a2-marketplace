// index.ts
import { defineStore } from "pinia";
import { useDashboardState } from "./state";
// import { useDashboardGetters } from "./getters";
import { useDashboardActions } from "./actions";

export const useDashboardStore = defineStore("dashboard", () => {
  const state = useDashboardState();
  // const getters = useDashboardGetters();
  const actions = useDashboardActions();

  return {
    ...state,
    // ...getters,
    ...actions,
  };
});
