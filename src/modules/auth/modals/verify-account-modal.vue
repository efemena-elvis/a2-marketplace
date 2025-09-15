<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Verify email address</div>
        <div class="modal-cover-meta">
          An confirmation code has been sent to your email address at
          elvis@vesicash.com
        </div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-3">
        <!-- CONFIRMATION CODE -->
        <TextFieldInput
          labelId="confirmationCode"
          labelTitle="Confirmation code"
          :inputType="IInputType.Number"
          inputPlaceholder="Provide the confirmation code received"
          isRequired
        />

        <div class="helper-row -mt-3 mb-3">
          <div class="text text-grey-600/60 text-xs">
            Didn't receive a confirmation code?
            <a href="">Resend code</a>.
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer">
        <button class="btn btn-primary w-full">Verify code</button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { IInputType } from "@/models/form-type";
import ModalDialog from "@/shared/components/global-comps/modal-dialog.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
</script>

<style lang="scss" scoped>
.form-group {
  @apply flex justify-center items-start gap-3;

  input {
    @apply text-center py-[10px] px-3 size-14;
  }
}
</style>
