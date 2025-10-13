<template>
  <div class="pricing-page">
    <!-- PAGE HEADER - REDESIGNED -->
    <div class="header-section">
      <div class="app-container">
        <h1 class="title-text">Find the perfect plan for your business</h1>
        <p class="description-text">
          Start for free and scale as you grow. All plans include our core
          compliance features.
        </p>

        <!-- BILLING CYCLE TOGGLE -->
        <div class="billing-toggle">
          <span :class="{ active: billingCycle === 'monthly' }">Monthly</span>
          <div class="toggle-switch" @click="toggleBillingCycle">
            <div
              class="switch-handle"
              :class="{ 'translate-x-full': billingCycle === 'yearly' }"
            ></div>
          </div>
          <span :class="{ active: billingCycle === 'yearly' }">
            Yearly <span class="discount-badge">Save 20%</span>
          </span>
        </div>
      </div>
    </div>

    <!-- PRICING CARDS SECTION -->
    <div class="app-container pricing-section">
      <!-- PLAN 1: BASIC -->
      <div class="pricing-card">
        <div class="plan-name">Basic</div>
        <div class="plan-price">
          <span class="amount">{{
            billingCycle === "monthly" ? "₦15" : "₦12"
          }}</span>
          <span class="period">/ per invoice</span>
        </div>
        <p class="plan-description">
          For startups and businesses getting started with e-invoicing.
        </p>
        <router-link to="/sign-up" class="btn btn-secondary btn-lg cta-button"
          >Get Started</router-link
        >
        <div class="divider"></div>
        <div class="features">
          <ul class="features-list">
            <li class="feature-item"><span>Up to 100 invoices/month</span></li>
            <li class="feature-item"><span>Automated Zoho Sync</span></li>
            <li class="feature-item">
              <span>IRN Generation & Validation</span>
            </li>
            <li class="feature-item"><span>Email Support</span></li>
          </ul>
        </div>
      </div>

      <!-- PLAN 2: GROWTH (HIGHLIGHTED) -->
      <div class="pricing-card highlighted">
        <div class="highlight-badge">Recommended</div>
        <div class="plan-name">Growth</div>
        <div class="plan-price">
          <span class="amount">{{
            billingCycle === "monthly" ? "₦50,000" : "₦40,000"
          }}</span>
          <span class="period">/ month</span>
        </div>
        <p class="plan-description">
          For growing businesses that need unlimited scale and team features.
        </p>
        <router-link to="/sign-up" class="btn btn-primary btn-lg cta-button"
          >Choose Plan</router-link
        >
        <div class="divider"></div>
        <div class="features">
          <ul class="features-list">
            <li class="feature-item">
              <span><strong>Unlimited</strong> Invoices</span>
            </li>
            <li class="feature-item"><span>Automated Zoho Sync</span></li>
            <li class="feature-item">
              <span>Team Members (Up to 5 users)</span>
            </li>
            <li class="feature-item">
              <span>API Access for Integrations</span>
            </li>
            <li class="feature-item">
              <span>Priority Email & Chat Support</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- PLAN 3: ENTERPRISE -->
      <div class="pricing-card">
        <div class="plan-name">Enterprise</div>
        <div class="plan-price">
          <span class="amount-custom">Custom</span>
        </div>
        <p class="plan-description">
          For large-scale organizations with custom compliance and support
          needs.
        </p>
        <router-link to="/contact" class="btn btn-secondary btn-lg cta-button"
          >Contact Sales</router-link
        >
        <div class="divider"></div>
        <div class="features">
          <ul class="features-list">
            <li class="feature-item">
              <span>Everything in Growth, plus:</span>
            </li>
            <li class="feature-item"><span>Unlimited Team Members</span></li>
            <li class="feature-item"><span>Dedicated Account Manager</span></li>
            <li class="feature-item">
              <span>Custom Onboarding & Training</span>
            </li>
            <li class="feature-item">
              <span>Service Level Agreement (SLA)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type BillingCycle = "monthly" | "yearly";

const billingCycle = ref<BillingCycle>("monthly");

const toggleBillingCycle = () => {
  billingCycle.value = billingCycle.value === "monthly" ? "yearly" : "monthly";
};
</script>

<style lang="scss" scoped>
.pricing-page {
  @apply w-full pt-24 pb-20;
}

// Redesigned Header
.header-section {
  @apply text-center pt-16 pb-20 mb-16 sm:mb-12 relative overflow-hidden;
  background: radial-gradient(circle at top, var(--primary-50), white);

  .title-text {
    @apply text-grey-900 font-medium text-4xl lg:text-3xl mb-4 relative z-10;
  }

  .description-text {
    @apply text-grey-900/70 text-lg mdLg:text-base sm:text-[15px] max-w-2xl mx-auto relative z-10;
  }

  .billing-toggle {
    @apply mt-8 flex justify-center items-center gap-x-3 relative z-10;

    span {
      @apply text-grey-600 font-medium transition-colors duration-300;
      &.active {
        @apply text-primary-900;
      }
    }

    .discount-badge {
      @apply ml-1 text-green-600 bg-green-100 px-2 py-0.5 rounded-full text-xs;
    }

    .toggle-switch {
      @apply w-12 h-6 bg-primary-200 rounded-full cursor-pointer p-1 flex items-center;
      .switch-handle {
        @apply w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out;
      }
    }
  }
}

.pricing-section {
  @apply grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-8 items-start;
}

.pricing-card {
  @apply w-full bg-white border border-grey-200/80 rounded-2xl p-8 sm:p-6 flex flex-col items-center shadow-sm relative;
  transition: all 300ms ease-in-out;

  &:hover {
    @apply shadow-xl transform -translate-y-2;
  }

  &.highlighted {
    @apply border-2 border-primary-900;
    transform: scale(1.05);

    &:hover {
      transform: scale(1.05) translateY(-8px);
    }
  }

  .highlight-badge {
    @apply absolute -top-4 bg-primary-900 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider;
  }

  .plan-name {
    @apply text-primary-900 font-semibold text-lg mb-4;
  }

  .plan-price {
    @apply flex items-end justify-center mb-3;
    .amount {
      @apply text-grey-900 font-medium text-5xl;
    }
    .period {
      @apply text-grey-600/90 text-base mb-1 ml-2;
    }
    .amount-custom {
      @apply text-grey-900 font-medium text-3xl h-[60px] flex items-center;
    }
  }

  .plan-description {
    @apply text-grey-700 text-center text-sm mb-8 h-16; // Fixed height for alignment
  }

  .cta-button {
    @apply w-full;
  }

  .divider {
    @apply w-full h-px bg-grey-200/90 my-8;
  }

  .features {
    @apply w-full flex flex-col items-start;
  }

  .features-list {
    @apply w-full flex flex-col gap-y-4;
  }

  .feature-item {
    @apply flex items-start gap-x-3;
    span {
      @apply text-grey-700 text-[15px];
    }
    strong {
      @apply font-semibold;
    }
  }
}
</style>
