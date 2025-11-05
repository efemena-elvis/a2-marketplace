<template>
  <!-- HERO SECTION -->
  <div class="app-container hero-section">
    <!-- CONTENT AREA -->
    <div class="content-area">
      <div class="title-text">
        Seamless e-Invoicing Compliance for Your Business
      </div>

      <div class="description-text">
        A2 Core helps you stay compliant; easily and seamlessly
      </div>

      <div class="cta-row">
        <router-link to="/create-account" class="btn btn-primary btn-lg"
          >Get Started</router-link
        >
        <router-link to="/#features" class="btn btn-secondary btn-lg"
          >Learn More</router-link
        >
      </div>
    </div>

    <!-- IMAGE AREA -->
    <div class="img-area">
      <img src="@/shared/assets/images/hero-img.png" alt="hero-img" />
    </div>
  </div>

  <!-- INFO SECTION -->
  <div class="app-container info-section">
    <div class="info-text">
      Connect your ERP or upload invoices directly. A2 Core validates and routes
      them to FIRS; fast, secure, compliant.
    </div>

    <div class="info-img">
      <img src="@/shared/assets/images/firs-logo.png" alt="firs-img" />
    </div>

    <div class="info-help-text">
      Authorised by the Federal Inland Revenue Service (FIRS)
    </div>
  </div>

  <!-- FEATURES SECTION -->
  <div class="app-container feature-section" id="features">
    <div class="section-title">Features</div>

    <div class="feature-row">
      <div class="feature-item">
        <div class="feature-icon">
          <img src="@/shared/assets/images/feature-one.png" alt="feature-1" />
        </div>

        <div class="feature-title">E-Invoice Integration</div>

        <div class="feature-description">
          Seamlessly integrate with your existing invoicing system
        </div>
      </div>

      <div class="feature-item">
        <div class="feature-icon">
          <img src="@/shared/assets/images/feature-two.png" alt="feature-2" />
        </div>

        <div class="feature-title">Validation</div>

        <div class="feature-description">
          Ensure e-invoices are validated for compliance
        </div>
      </div>

      <div class="feature-item">
        <div class="feature-icon">
          <img src="@/shared/assets/images/feature-three.png" alt="feature-3" />
        </div>

        <div class="feature-title">Transmission</div>

        <div class="feature-description">
          Efficiently transmit validated invoices over our secure rails
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.hero-section {
  @apply h-screen pt-12 flex justify-between items-center gap-x-4;

  .content-area {
    @apply flex flex-col justify-center items-start md:items-center text-grey-900 w-[650px] xl:w-[70%] lg:w-[80%] md:w-full;

    .title-text {
      @apply font-normal text-[52px] xl:text-[44px] lg:text-[36px] md:text-[40px] sm:text-[32px] leading-[62px] xl:leading-[54px] lg:leading-[46px] md:leading-[50px] sm:leading-[42px] mb-5 md:text-center;
    }

    .description-text {
      @apply text-xl mb-10 md:text-center;
    }

    .cta-row {
      @apply flex justify-start items-center gap-x-5;
    }
  }

  .img-area {
    @apply md:hidden;

    img {
      @apply relative left-20 lg:left-0 w-[950px] h-auto object-contain;
    }
  }
}

.info-section {
  @apply flex flex-col justify-center items-center w-1/2 lg:w-3/4 md:w-4/5 sm:w-full sm:px-3.5 mx-auto;

  .info-text {
    @apply text-grey-900/70 font-light text-[22px] mdLg:text-xl sm:text-lg mb-8 text-center;
  }

  .info-img {
    @apply flex justify-center items-start mb-2;

    img {
      @apply w-[70px] h-auto;
    }
  }

  .info-help-text {
    @apply text-grey-900/80 text-base text-center;
  }
}

.feature-section {
  @apply w-4/5 lg:w-full mx-auto py-32 sm:py-28;

  .section-title {
    @apply text-grey-900 font-medium text-4xl lg:text-3xl mb-20 sm:mb-16 text-center;
  }

  .feature-row {
    @apply grid grid-cols-3 md:grid-cols-1 gap-6 lg:gap-4 mdLg:gap-2 md:gap-24 sm:gap-20;

    .feature-item {
      @apply flex flex-col justify-start items-center;

      .feature-icon {
        @apply mb-8;

        img {
          @apply size-[86px] lg:size-[80px] min-h-[86px] lg:min-h-[80px] min-w-[86px] lg:min-w-[80px] object-contain;
        }
      }

      .feature-title {
        @apply text-grey-900 font-medium text-2xl lg:text-xl md:text-2xl sm:text-xl text-center mb-4;
      }

      .feature-description {
        @apply text-grey-900/70 text-xl lg:text-lg mdLg:text-base md:text-lg text-center font-light w-4/5 mx-auto;
      }
    }
  }
}
</style>
