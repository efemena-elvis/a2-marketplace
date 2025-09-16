<template>
  <div
    class="fixed top-0 w-full z-20 transition-all duration-300 ease-in-out bg-neutral-10"
    ref="navbar"
  >
    <div class="app-container">
      <div class="header-row">
        <!-- BRAND LOGO -->
        <div class="brand-logo">
          <img src="@/shared/assets/images/a2-logo.png" alt="a2 Marketplace" />
          <div class="brand-name">A2 Marketplace</div>
        </div>

        <!-- NAVIGATION LINKS -->
        <div class="navigation">
          <!-- NAVIGATION ITEMS -->
          <div class="nav-items">
            <router-link to="/" class="nav-link nav-link-active"
              >Home</router-link
            >
            <!-- <router-link to="#features" class="nav-link">Features</router-link> -->
            <router-link to="/pricing" class="nav-link">Pricing</router-link>
            <router-link to="/developers" class="nav-link"
              >Developers</router-link
            >
            <router-link to="/contact" class="nav-link">Contact</router-link>
          </div>

          <!-- NAVIGATION ACTIONS -->
          <div class="nav-actions">
            <router-link to="/login" class="btn btn-secondary btn-sm"
              >Sign In</router-link
            >

            <router-link to="/create-account" class="btn btn-primary btn-sm"
              >Create Account</router-link
            >
          </div>

          <!-- MOBILE NAV MENU -->
          <div class="mobile-nav-menu">
            <div class="icon icon-menu"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
</script>

<style lang="scss" scoped>
.header-row {
  @apply flex items-center justify-between py-8 sm:py-6;

  .brand-logo {
    @apply flex justify-start items-center gap-x-2;

    img {
      @apply size-12 lg:size-11 object-contain;
    }

    .brand-name {
      @apply text-primary-900 font-medium text-xl lg:text-base mdLg:text-lg;
    }
  }

  .navigation {
    @apply flex items-center justify-end gap-8 lg:gap-5;

    .nav-items {
      @apply flex items-center justify-start gap-3 lg:gap-1 mdLg:hidden;

      .nav-link {
        @apply text-primary-900/80 text-base lg:text-[15px] transition duration-300 ease-in-out px-3.5 lg:px-3 py-2 rounded-full hover:bg-primary-50;

        &-active {
          @apply bg-primary-50 font-semibold;
        }
      }
    }

    .nav-actions {
      @apply flex items-center justify-end gap-4 mdLg:hidden;
    }

    .mobile-nav-menu {
      @apply hidden mdLg:block cursor-pointer;

      .icon {
        @apply text-4xl text-primary-900 font-medium;
      }
    }
  }
}
</style>
