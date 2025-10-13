<template>
  <div
    class="fixed top-0 w-full z-20 transition-all duration-300 ease-in-out bg-neutral-10"
    ref="navbar"
  >
    <div class="app-container">
      <div class="header-row">
        <!-- BRAND LOGO -->
        <div class="brand-logo">
          <img
            src="@/shared/assets/images/brand-logo.png"
            alt="CISL Marketplace"
          />
        </div>

        <!-- NAVIGATION LINKS -->
        <div class="navigation">
          <!-- NAVIGATION ITEMS - NOW DYNAMIC -->
          <div class="nav-items">
            <router-link
              v-for="link in navLinks"
              :key="link.name"
              :to="link.path"
              class="nav-link"
              >{{ link.name }}</router-link
            >
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

// Define navigation links as an array of objects
const navLinks = ref([
  { name: "Home", path: "/home" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
]);
</script>

<style lang="scss" scoped>
.header-row {
  @apply flex items-center justify-between py-8 sm:py-6;

  .brand-logo {
    @apply flex justify-start items-center gap-x-2;
    img {
      @apply w-[220px] h-auto;
    }
  }

  .navigation {
    @apply flex items-center justify-end gap-8 lg:gap-5;

    .nav-items {
      @apply flex items-center justify-start gap-3 lg:gap-1 mdLg:hidden;

      .nav-link {
        @apply text-grey-900/80 text-base lg:text-[15px] transition duration-300 ease-in-out px-3.5 lg:px-3 py-2 rounded-full hover:bg-primary-50;

        // This styles the active class provided automatically by Vue Router
        // It will be applied to the link that matches the current URL.
        &.router-link-exact-active {
          @apply bg-primary-50 font-medium text-primary-900;
        }
      }
    }

    .nav-actions {
      @apply flex items-center justify-end gap-4 mdLg:hidden;
    }

    .mobile-nav-menu {
      @apply hidden mdLg:block cursor-pointer;
      .icon {
        @apply text-4xl text-grey-900 font-medium;
      }
    }
  }
}
</style>
