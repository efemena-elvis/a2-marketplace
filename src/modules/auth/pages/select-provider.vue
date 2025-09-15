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

      <!-- TITLE TEXT -->
      <div class="text-xl md:text-lg text-primary-900/90 text-center mb-2">
        What's your Invoicing Solution?
      </div>

      <!-- SUBTITLE TEXT -->
      <div class="text-sm font-light text-primary-900/70 text-center mb-8">
        Select the software used to generate your invoices
      </div>

      <div class="">
        <div class="provider-row mb-8">
          <div class="provider-item">
            <img src="@/shared/assets/images/zoho.png" alt="zoho" />
            <div class="provider-text">Zoho</div>
          </div>

          <div class="provider-item">
            <img
              src="@/shared/assets/images/sage.png"
              alt="sage"
              class="!w-[70%]"
            />
            <div class="provider-text">Sage</div>
          </div>

          <div class="provider-item">
            <img src="@/shared/assets/images/quickbooks.png" alt="quickbooks" />
            <div class="provider-text">QuickBooks</div>
          </div>

          <div class="provider-item">
            <img
              src="@/shared/assets/images/salesforce.png"
              alt="salesforce"
              class="!w-[70%]"
            />
            <div class="provider-text">Salesforce</div>
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
    @apply w-[46%] px-12 py-10 rounded-xl bg-neutral-10 shadow-sm;

    .brand-logo {
      img {
        @apply size-20 sm:w-[70px];
      }
    }

    .provider-row {
      @apply grid grid-cols-2 gap-6;

      .provider-item {
        @apply w-full h-auto px-7 py-4 relative flex flex-col justify-center items-center gap-y-4 rounded-xl border border-grey-300 cursor-pointer hover:bg-grey-50/60 hover:border-primary-900 transition duration-300 ease-in-out;

        img {
          @apply w-4/5 h-auto;
        }

        .provider-text {
          @apply text-sm font-medium text-center text-primary-900;
        }
      }
    }
  }
}
</style>
