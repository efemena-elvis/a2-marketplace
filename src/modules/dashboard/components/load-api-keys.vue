<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useSettingsStore } from "@/modules/settings/store";
import useEvents from "@/shared/composables/useEvents";
import { useStorage } from "@/shared/composables/useStorage";

// --- COMPOSABLES and STORE ---
const { getApiKeys, createApiKey } = useSettingsStore();
const { processAPIRequest } = useEvents();
const { setStorage } = useStorage();

// --- CONSTANTS ---
const API_KEY_STORAGE_NAME = "API_KEY";

/**
 * Saves the API token to local storage.
 * It constructs the full key from the prefix and token.
 * @param keyData - The API key object from the backend response.
 */
const saveApiKeyToLocalStorage = (keyData: any) => {
  if (keyData && keyData.token) {
    const fullApiKey = `${keyData.token}`;

    setStorage({
      storage_name: API_KEY_STORAGE_NAME,
      storage_value: fullApiKey,
      storage_type: "string",
    });
    console.log("API Key has been successfully saved to local storage.");
  } else {
    console.error(
      "Failed to save API Key: Invalid key data received.",
      keyData
    );
  }
};

/**
 * Handles the generation of a new API key and saves it.
 */
const generateAndSaveKey = async () => {
  console.log("No API keys found. Generating a new one...");
  try {
    const response = await processAPIRequest({
      action: createApiKey,
      showAlert: false, // Don't show UI alerts for this background process
    });

    if (response && (response.status === 200 || response.status === 201)) {
      saveApiKeyToLocalStorage(response.data.data);
    } else {
      throw new Error("API response was not successful when creating a key.");
    }
  } catch (error) {
    console.error("An error occurred while generating a new API key:", error);
  }
};

/**
 * Fetches the list of existing API keys.
 * If keys exist, it saves the most recent one.
 * If no keys exist, it triggers the generation of a new one.
 */
const initializeApiKeys = async () => {
  console.log("Initializing API key check...");
  try {
    const response = await processAPIRequest({
      action: getApiKeys,
      showAlert: false,
    });

    if (response && response.status === 200) {
      const apikeyList = response.data.data;

      if (apikeyList && apikeyList.length > 0) {
        // Keys exist, get the last one created (assuming the API returns them in order)
        const lastKey = apikeyList[apikeyList.length - 1];
        console.log("Existing API keys found. Using the most recent one.");
        saveApiKeyToLocalStorage(lastKey);
      } else {
        // No keys exist, so we need to create one.
        await generateAndSaveKey();
      }
    } else {
      // If the initial fetch fails, it might be a permissions issue or new account.
      // We can cautiously try to generate a key.
      console.warn(
        "Could not fetch API keys. Attempting to generate a new key as a fallback."
      );
      await generateAndSaveKey();
    }
  } catch (error) {
    console.error("An error occurred during API key initialization:", error);
  }
};

// --- LIFECYCLE HOOK ---
// When this component is mounted, it will automatically run the API key check.
onMounted(() => {
  initializeApiKeys();
});
</script>

// { "message": "Create success", "data": { "id": //
"583ca764-334c-4298-bc77-dc20fa43c017", "name": //
"04196b4c-ed12-4be5-90a7-efe39050e520", "prefix": "ak_KiHLUKUnt2", "created_at":
// "2025-10-20 11:38:01", "last_used_at": null, "revoked_at": null,
"external_id": // "wdthyzjntg", "source": "mgmt", "token": //
"KiHLUKUnt28bQhFIXV1sU4ScQkZmjPHY3hwUOts0" } }
