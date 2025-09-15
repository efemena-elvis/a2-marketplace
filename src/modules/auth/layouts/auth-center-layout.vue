<template>
  <div
    class="auth-layout relative h-screen py-[50px] px-[100px] xl:px-[66px] lg:px-[50px] md:px-7 sm:px-3"
  >
    <!-- CLOSE TRIGGER -->
    <div class="close-trigger" @click="router.push('/')">
      <div class="icon icon-times"></div>
    </div>

    <div class="container-wrapper">
      <a href="/" class="brand-logo relative block mx-auto w-max mb-8">
        <img src="@/shared/assets/images/a2-logo.png" alt="a2-logo" />
      </a>

      <div class="flex justify-center items-start">
        <div class="w-full">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useColor } from "@/shared/composables/useColor";

const router = useRouter();
const { setPageBackgroundColor } = useColor();

onMounted(() => setPageBackgroundColor("#EDF0F2"));
</script>

<style lang="scss" scoped>
.auth-layout {
  @apply h-screen flex flex-col justify-center items-center;

  .close-trigger {
    @apply w-12 h-12 rounded-full bg-primary-100 cursor-pointer absolute top-8 right-8 z-10 flex justify-center items-center hover:bg-red-100/80 transition duration-300 ease-in-out;

    .icon {
      @apply text-3xl text-primary-800;
    }
  }

  .container-wrapper {
    @apply w-[44%] p-14 rounded-xl bg-neutral-10 shadow-sm;

    .brand-logo {
      img {
        @apply size-20 sm:w-[70px];
      }
    }
  }
}
</style>
