<template>
  <div
    class="auth-layout relative px-[100px] xl:px-[66px] lg:px-[50px] md:px-7 sm:px-3"
  >
    <!-- CLOSE TRIGGER -->
    <div class="close-trigger" @click="router.push('/')">
      <div class="icon icon-times"></div>
    </div>

    <div class="container-wrapper">
      <a href="/" class="brand-logo relative block mx-auto w-max mb-8">
        <img src="@/shared/assets/images/brand-logo-icon.png" alt="a2-logo" />
      </a>

      <!-- TITLE TEXT -->
      <div class="text-xl md:text-lg text-grey-900/90 text-center mb-2">
        What's your Invoicing Solution?
      </div>

      <!-- SUBTITLE TEXT -->
      <div class="text-sm font-light text-grey-900/70 text-center mb-8">
        Select the software used to generate your invoices
      </div>

      <div class="">
        <div class="provider-row mb-8">
          <div
            class="provider-item"
            :class="{ 'provider-item-selected': provider.active }"
            v-for="provider in providers"
            :key="provider.name"
            @click="selectProvider(provider)"
          >
            <img :src="renderImg(provider.logo)" :alt="provider.name" />
            <div class="provider-text">{{ provider.name }}</div>
          </div>
        </div>

        <!-- ACTION ROW -->
        <div class="action-row flex justify-between items-center">
          <router-link
            to="/create-account"
            class="btn btn-secondary btn-sm !px-10"
            >Skip</router-link
          >

          <router-link
            to="/create-account"
            class="btn btn-primary btn-sm !px-10"
            >Continue</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useColor } from "@/shared/composables/useColor";
import { useString } from "@/shared/composables/useString";

const { renderImg } = useString();

const router = useRouter();
const { setPageBackgroundColor } = useColor();

const providers = ref([
  {
    name: "Zoho",
    slug: "zoho",
    logo: "zoho.png",
    active: true,
  },
  {
    name: "Sage",
    slug: "sage",
    logo: "sage.png",
    active: false,
  },
  {
    name: "QuickBooks",
    slug: "quickbooks",
    logo: "quickbooks.png",
    active: false,
  },
  {
    name: "Salesforce",
    slug: "salesforce",
    logo: "salesforce.png",
    active: false,
  },
]);

const selectProvider = (provider: any) => {
  providers.value = providers.value.map((p) => ({
    ...p,
    active: p.name === provider.name,
  }));
};

onMounted(() => setPageBackgroundColor("#EDF0F2"));
</script>

<style lang="scss" scoped>
.auth-layout {
  @apply relative mt-20 xl:mt-12 flex flex-col justify-start items-center;

  .close-trigger {
    @apply size-12 md:size-10 rounded-full bg-primary-100 cursor-pointer fixed top-8 sm:top-6 right-8 sm:right-4 z-10 flex justify-center items-center hover:bg-red-100/80 transition duration-300 ease-in-out;

    .icon {
      @apply text-3xl md:text-2xl text-primary-800;
    }
  }

  .container-wrapper {
    @apply w-[44%] xl:w-[50%] lg:w-[60%] mdLg:w-4/5 sm:w-[96%] xs:w-[98%] p-14 lg:p-12 sm:py-10 sm:px-8 xs:px-5 rounded-xl bg-neutral-10 shadow-sm mb-20;

    .brand-logo {
      img {
        @apply size-20 lg:size-16 sm:size-14;
      }
    }

    .provider-row {
      @apply grid grid-cols-2 sm:grid-cols-1 gap-6;

      .provider-item {
        @apply w-full h-auto p-7 relative flex flex-col justify-center items-center gap-y-4 rounded-xl border border-grey-300 cursor-pointer hover:bg-grey-50/60 hover:border-primary-800/50 transition duration-300 ease-in-out;

        &-selected {
          @apply border-2 border-primary-800;
        }

        img {
          @apply w-auto h-[40px];
        }

        .provider-text {
          @apply text-sm sm:text-base font-medium text-center text-primary-900;
        }
      }
    }
  }
}
</style>
