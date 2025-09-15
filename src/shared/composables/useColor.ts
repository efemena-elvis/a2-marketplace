import { ref } from "vue";

export function useColor() {
  const backgroundColor = ref<string>("");

  function setPageBackgroundColor(color: string): void {
    document.body.style.backgroundColor = color;
    backgroundColor.value = color;
  }

  return {
    setPageBackgroundColor,
    backgroundColor,
  };
}
