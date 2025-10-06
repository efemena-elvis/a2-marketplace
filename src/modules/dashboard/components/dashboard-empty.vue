<template>
  <div class="dashboard-empty-state">
    <div class="content-card">
      <div class="illustration">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 11L16.75 8.25M11 13L8.25 16.75"
            stroke="#1E5DB5"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M11 3.5C7.96243 3.5 5.5 5.96243 5.5 9C5.5 12.0376 7.96243 14.5 11 14.5C14.0376 14.5 16.5 12.0376 16.5 9C16.5 5.96243 14.0376 3.5 11 3.5Z"
            stroke="#15458B"
            stroke-width="1.5"
          />
          <path
            d="M15 12.5C14.3358 12.5 13.7231 12.8358 13.3852 13.3852C12.8358 13.7231 12.5 14.3358 12.5 15C12.5 16.3807 13.6193 17.5 15 17.5C16.3807 17.5 17.5 16.3807 17.5 15C17.5 13.6193 16.3807 12.5 15 12.5Z"
            stroke="#2C75D8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <h1 class="headline">Automate Your Invoice Validation</h1>
      <p class="description">
        Save time and eliminate errors by connecting your accounting software.
        We'll automatically fetch your new invoices for validation.
      </p>

      <div class="integrations-list">
        <div
          v-for="integration in integrations"
          :key="integration.name"
          class="integration-item"
        >
          <img
            :src="integration.logo"
            :alt="`${integration.name} Logo`"
            class="logo"
          />
          <span class="name">{{ integration.name }}</span>
          <button class="btn btn-secondary btn-sm" @click="handleConnectToZoho">
            Connect
          </button>
        </div>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>

      <a href="#" class="manual-upload-link link"
        >Manually upload your invoices</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import constants from "@/utilities/constants";

const integrations = ref([
  {
    name: "Zoho",
    logo: "https://res.cloudinary.com/dsf4yaopx/image/upload/v1759729156/ZOHO_New_f38bqi.png",
  },
]);

const handleConnectToZoho = () => {
  const ZOHO_CLIENT_ID = "1000.DF660IXJ0EV5HHP1XALIX8CDM6E3RK";
  const ZOHO_REDIRECT_URI =
    "https://staging-api.a2comply.com/invoices/v1/imports/zoho/auth";

  const SCOPES =
    "ZohoBooks.invoices.READ,ZohoBooks.invoices.UPDATE,ZohoInvoice.settings.READ";

  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${SCOPES}&client_id=${ZOHO_CLIENT_ID}&response_type=code&redirect_uri=${ZOHO_REDIRECT_URI}&access_type=offline`;

  // Redirect the user's browser to the Zoho authentication page
  window.location.href = authUrl;
};
</script>

<style lang="scss" scoped>
.dashboard-empty-state {
  @apply flex items-center justify-center w-full mt-16;

  .content-card {
    @apply w-full max-w-xl bg-neutral-10 border border-blue-100 rounded-2xl shadow-sm p-8 sm:p-12 text-center flex flex-col items-center;
  }

  .illustration {
    @apply flex items-center justify-center h-24 w-24 bg-blue-50 rounded-full mb-6;
    svg {
      @apply h-12 w-12;
    }
  }

  .headline {
    @apply text-2xl sm:text-3xl font-bold text-blue-900 mb-3;
  }

  .description {
    @apply text-base text-grey-700 max-w-md mb-8;
  }

  .integrations-list {
    @apply w-full flex flex-col sm:flex-row justify-center gap-4 mb-8;
  }

  .integration-item {
    @apply flex items-center w-full sm:w-auto flex-1 p-4 border border-grey-50 rounded-lg bg-neutral-10 transition-all duration-300;

    &:hover {
      @apply border-primary-300 bg-primary-50;
    }

    .logo {
      @apply h-12 w-auto mr-4;
    }

    .name {
      @apply flex-grow text-left font-semibold text-grey-800;
    }
  }

  .divider {
    @apply w-full max-w-xs flex items-center justify-center my-4;
    @apply text-sm uppercase text-grey-200 font-medium;

    &::before,
    &::after {
      @apply content-[''] flex-1 border-b border-grey-100;
    }

    span {
      @apply px-4;
    }
  }

  .manual-upload-link {
    // Uses the global .link style you provided
    @apply font-medium text-primary-800;
  }
}
</style>
