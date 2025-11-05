<template>
  <div class="contact-page">
    <!-- PAGE HEADER -->
    <div class="header-section">
      <div class="app-container">
        <h1 class="title-text">Get in Touch</h1>
        <p class="description-text">
          Have a question or need help getting started? We'd love to hear from
          you.
        </p>
      </div>
    </div>

    <!-- MAIN CONTENT SECTION -->
    <div class="app-container content-section">
      <div class="contact-grid">
        <!-- LEFT COLUMN: CONTACT FORM -->
        <div class="form-container">
          <h2 class="form-title">Send us a Message</h2>
          <form @submit.prevent="handleSubmit">
            <!-- Full Name Input -->
            <TextFieldInput
              label-id="fullName"
              :input-type="IInputType.Text"
              label-title="Full Name"
              input-placeholder="Enter your full name"
            />

            <!-- Email Address Input -->
            <TextFieldInput
              label-id="emailAddress"
              :input-type="IInputType.Email"
              label-title="Email Address"
              input-placeholder="Enter your email address"
            />

            <!-- Message Textarea -->
            <TextFieldInput
              label-id="message"
              :input-type="IInputType.Text"
              label-title="Your Message"
              input-placeholder="How can we help?"
              is-text-area
            />

            <!-- Submit Button -->
            <button class="btn btn-primary btn-lg w-full">Send Message</button>
          </form>
        </div>

        <!-- RIGHT COLUMN: CONTACT DETAILS -->
        <div class="details-container">
          <div class="detail-item">
            <div class="icon-wrapper">
              <div class="icon icon-sms-tracking"></div>
            </div>
            <div class="text-wrapper">
              <h3 class="detail-title">Email Us</h3>
              <p class="detail-text">
                Our support team will get back to you within 24 hours.
              </p>
              <a href="mailto:support@a2core.com" class="detail-link"
                >support@a2core.com</a
              >
            </div>
          </div>

          <div class="detail-item">
            <div class="icon-wrapper">
              <div class="icon icon-support-icon"></div>
            </div>
            <div class="text-wrapper">
              <h3 class="detail-title">Call Us</h3>
              <p class="detail-text">Mon-Fri from 9am to 5pm.</p>
              <a href="tel:+2340000000000" class="detail-link"
                >+234 000 000 0000</a
              >
            </div>
          </div>

          <div class="detail-item">
            <div class="icon-wrapper">
              <div class="icon icon-location"></div>
            </div>
            <div class="text-wrapper">
              <h3 class="detail-title">Our Office</h3>
              <p class="detail-text">
                123 Compliance Street,<br />Lagos, Nigeria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TextFieldInput } from "@/shared/components/form-comps";
import { IInputType } from "@/models/form-type";

// A simple handler for the form submission
const handleSubmit = () => {
  // In a real application, you would collect the form data
  // and send it to your backend API here.
  alert("Thank you for your message! We will be in touch shortly.");
  // You might also want to reset the form fields after submission.
};
</script>

<style lang="scss" scoped>
.contact-page {
  @apply w-full pt-32 pb-20;
}

.header-section {
  @apply text-center mb-16 sm:mb-12;

  .title-text {
    @apply text-grey-900 font-medium text-4xl lg:text-3xl mb-4;
  }

  .description-text {
    @apply text-grey-900/70 text-lg mdLg:text-base sm:text-[15px] max-w-2xl mx-auto;
  }
}

.content-section {
  @apply flex justify-center;
}

.contact-grid {
  @apply grid grid-cols-2 lg:grid-cols-1 gap-16 lg:gap-12 w-full max-w-5xl;
}

.form-container {
  @apply bg-white p-8 border border-grey-200/70 rounded-xl shadow-sm;

  .form-title {
    @apply text-2xl font-semibold text-grey-900 mb-8;
  }
}

.details-container {
  @apply flex flex-col gap-y-8 pt-4;

  .detail-item {
    @apply flex items-start gap-x-5;

    .icon-wrapper {
      @apply flex-shrink-0 size-12 bg-primary-50 rounded-full flex items-center justify-center;
      .icon {
        @apply text-primary-800 text-2xl;
      }
    }

    .text-wrapper {
      @apply flex flex-col items-start;
      .detail-title {
        @apply text-lg font-semibold text-grey-900;
      }
      .detail-text {
        @apply text-grey-700 text-[15px] mt-1;
      }
      .detail-link {
        @apply text-primary-800 font-medium mt-2 text-[15px] hover:underline;
      }
    }
  }
}
</style>
