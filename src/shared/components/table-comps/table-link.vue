<template>
  <div class="action-wrapper">
    <router-link :to="linkRoute" class="flex items-center gap-x-1">
      <div class="icon icon-eye text-[17px]"></div>
      <div>{{ linkText }}</div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  linkText: {
    type: String,
    default: "View",
  },

  linkRoute: {
    type: String,
    default: "",
  },
});
</script>
