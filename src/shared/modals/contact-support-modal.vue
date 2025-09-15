<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Contact Support</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-3">
        <!-- MESSAGE SUPPORT -->
        <TextFieldInput
          labelId="messageSupport"
          labelTitle="Message support"
          :inputType="IInputType.Text"
          inputPlaceholder="Enter your message here..."
          isRequired
          isTextArea
          @inputChanged="supportPayload.message = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please enter a message',
          }"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer -mt-4">
        <button
          class="btn btn-primary w-full"
          ref="initiateSupportBtnRef"
          :disabled="isActionReady"
          @click="handleContactSupport"
        >
          Send Message
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { IInputType } from "@/models/form-type";
import ModalDialog from "@/shared/components/global-comps/modal-dialog.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import useEvents from "@/shared/composables/useEvents";
import { useString } from "@/shared/composables/useString";
import { useGeneralStore } from "@/store/general";

const emits = defineEmits(["closeTriggered", "reloadStorefront"]);

const { capitalizeFirstLetter } = useString();
const { processAPIRequest, pushToastAlert } = useEvents();

const { contactSupport } = useGeneralStore();

const supportPayload = ref<{ message: string }>({
  message: "",
});

const initiateSupportBtnRef = ref(null);

const isActionReady = computed(() => {
  return supportPayload.value.message ? false : true;
});

const handleContactSupport = async () => {
  const response = await processAPIRequest({
    action: contactSupport,
    payload: supportPayload.value,
    btnRef: initiateSupportBtnRef,
    btnText: "Send Message",
    alertHandler: {
      200: {
        message: "Message sent successfully",
        description: "",
        type: "success",
      },
    },
  });

  if (response.code === 200) {
    emits("closeTriggered");
  }

  // HANDLE ANY NON 200 ERRORS
  else {
    pushToastAlert({
      message: "Failed to send message",
      description: capitalizeFirstLetter(response.message),
      type: "error",
    });
  }
};
</script>

<style lang="scss" scoped>
.storefront-display-block {
  @apply border border-grey-300 rounded-md px-4 py-3 -mt-1 mb-8;

  .top-row {
    @apply flex justify-start items-center gap-x-2 mb-2;

    .icon {
      @apply text-lg text-grey-600;
    }

    .ptimary-text {
      @apply text-[14px] text-grey-700 font-semibold;
    }
  }

  .bottom-row {
    @apply flex justify-start items-start text-sm;

    .base-domain-url {
      @apply text-grey-500;
    }

    .secondary-domain-url {
      @apply text-grey-600 font-semibold break-all text-wrap whitespace-pre;
    }
  }
}
</style>
