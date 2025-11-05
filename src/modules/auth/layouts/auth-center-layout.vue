<template>
  <div
    class="auth-layout relative py-[20px] px-[100px] xl:px-[66px] lg:px-[50px] md:px-7 sm:px-3"
  >
    <!-- CLOSE TRIGGER -->
    <div class="close-trigger" @click="router.push('/')">
      <div class="icon icon-times"></div>
    </div>

    <div class="container-wrapper">
      <a href="/" class="brand-logo relative block mx-auto w-max mb-8">
        <img src="@/shared/assets/images/a2-logo.png" alt="a2-core-logo" />
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
  @apply relative top-20 xl:top-16 flex flex-col justify-start items-center;

  .close-trigger {
    @apply size-12 md:size-10 rounded-full bg-primary-100 cursor-pointer fixed top-8 sm:top-6 right-8 sm:right-4 z-10 flex justify-center items-center hover:bg-red-100/80 transition duration-300 ease-in-out;

    .icon {
      @apply text-3xl md:text-2xl text-grey-800;
    }
  }

  .container-wrapper {
    @apply w-[44%] xl:w-[50%] lg:w-[60%] mdLg:w-[70%] md:w-4/5 sm:w-[94%] xs:w-[98%] p-14 lg:p-12 sm:py-10 sm:px-8 xs:px-5 rounded-xl bg-neutral-10 shadow-sm;

    .brand-logo {
      img {
        @apply size-20 lg:size-16 sm:size-14;
        // @apply size-20 lg:size-16 sm:size-14;
      }
    }
  }
}
</style>
