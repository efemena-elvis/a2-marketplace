<template>
  <div class="app-container">
    <div class="footer-row">
      <!-- BRAND LOGO -->
      <div class="brand-logo">
        <img src="@/shared/assets/images/a2-logo.png" alt="A2 Core Portal" />
        <!-- <div class="brand-name">A2 Marketplace</div> -->
      </div>

      <!-- SOCIAL ICONS -->
      <div class="social-icons">
        <router-link
          to="https://facebook.com/vesicash"
          target="_blank"
          class="social-icon"
        >
          <div class="icon icon-facebook !text-[22px] relative top-[1px]"></div>
        </router-link>

        <router-link
          to="https://linkedin.com/vesicash"
          target="_blank"
          class="social-icon"
        >
          <div class="icon icon-linkedin"></div>
        </router-link>

        <router-link
          to="https://instagram.com/vesicash"
          target="_blank"
          class="social-icon"
        >
          <div class="icon icon-instagram"></div>
        </router-link>

        <router-link
          to="https://youtube.com/vesicash"
          target="_blank"
          class="social-icon"
        >
          <div class="icon icon-youtube"></div>
        </router-link>

        <router-link
          to="https://twitter.com/vesicash"
          target="_blank"
          class="social-icon"
        >
          <div class="icon icon-twitter"></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.footer-row {
  @apply flex items-center justify-between py-12 sm:py-9;

  .brand-logo {
    @apply flex justify-start items-center gap-x-2;

    img {
      @apply size-12 lg:size-11 sm:size-10 object-contain;
      // @apply w-[180px] h-auto;
    }

    .brand-name {
      @apply text-primary-900 font-medium text-lg sm:text-base;
    }
  }

  .social-icons {
    @apply flex justify-end items-center gap-x-2 sm:gap-x-1;

    .social-icon {
      @apply flex justify-center items-center size-9 sm:size-8 min-w-9 sm:min-w-8 min-h-9 sm:min-h-8 rounded-full hover:bg-primary-50;

      .icon {
        @apply text-grey-900/80 text-lg sm:text-base transition duration-300 ease-in-out hover:text-primary-900;
      }
    }
  }
}
</style>
