import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";

// APP STYLES IMPORT
import "@/tw-styles.scss";
import "@/shared/assets/scss/app.scss";

const app = createApp(App);
const pinia = createPinia();
const head = createHead();
const eventBus = mitt();

app.provide("eventBus", eventBus); // Provide the event bus

app.use(head);
app.use(pinia);
app.use(router);
app.mount("#app");
