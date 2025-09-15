// index.ts
import { defineStore } from "pinia";
import { useGeneralActions } from "./actions";

export const useGeneralStore = defineStore("general", () => {
  const actions = useGeneralActions();

  return {
    ...actions,
  };
});
