// index.ts
import { defineStore } from "pinia";
// import { useAuthState } from "./state";
// import { useAuthGetters } from "./getters";
import { useSettingsActions } from "./actions";

export const useSettingsStore = defineStore("settings", () => {
  // const state = useAuthState();
  // const getters = useAuthGetters();
  const actions = useSettingsActions();

  return {
    // ...state,
    // ...getters,
    ...actions,
  };
});
