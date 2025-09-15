<template>
  <div>
    <div class="base-layout">
      <Header />

      <div class="main-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useColor } from "@/shared/composables/useColor";
import { Header, Footer } from "@/modules/landing/components";

const { setPageBackgroundColor } = useColor();

onMounted(() => {
  setPageBackgroundColor("#ffffff");
});
</script>

<style lang="scss" scoped></style>
