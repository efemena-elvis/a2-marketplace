<template>
  <Head>
    <html :lang="getMetaLocales.current" />
    <meta property="og:locale" :content="getMetaLocales.current" />
    <meta
      v-for="locale in getMetaLocales.other"
      :key="locale"
      property="og:locale:alternate"
      :content="locale"
    />
    <!-- Page Title -->
    <title>{{ getMetaTitle }}</title>

    <!-- Description -->
    <meta name="description" :content="getMetaDescription" />

    <!-- Keywords -->
    <meta name="keywords" :content="metaKeywords" />

    <!-- Authors -->
    <meta name="author" :content="metaCompanyName" />
    <link rel="author" :href="metaCompanyBaseUrl" />
    <meta name="creator" :content="metaCompanyCreator" />

    <!-- Canonical and Language Alternates -->
    <link rel="canonical" :href="metaCompanyBaseUrl" />
    <link rel="alternate" hreflang="en-US" href="/en-US" />
  </Head>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Head } from "@vueuse/head";

const route = useRoute();
const metaTitle = "A2 Core Portal";
const metaDescription =
  "Simplify your tax compliance in Nigeria. Our platform helps businesses easily upload, validate, and pay their tax invoices online, ensuring seamless FIRS compliance.";
const metaKeywords =
  "E-invoicing Nigeria, FIRS compliance software, Tax payment portal Nigeria, Nigerian tax invoice validation, Pay tax online Nigeria, Business tax management Nigeria";
const metaCompanyName = "A2 Core Portal";
const metaCompanyCreator = "Efemena Elvis";
const metaCompanyBaseUrl = "https://a2core.vercel.app";

const getMetaLocales = computed(() => ({
  current: "en",
  other: ["fr", "es"],
}));

const getTitleText = computed(() =>
  route.meta.title ? `${route.meta.title} -` : ""
);

const getMetaTitle = computed(
  () => `${getTitleText.value} A2 Core` || metaTitle
);

const getMetaDescription = computed(() => {
  const { description } = route.meta;
  return typeof description === "string" ? description : metaDescription;
});
</script>
