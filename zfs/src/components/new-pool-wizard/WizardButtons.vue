<template>
   <div class="button-group-row">
      <button id="back" class="btn btn-secondary object-left justify-start" @click="props.prev">Back</button>
      <button v-if="!props.end" id="next" class="btn btn-primary object-right justify-end" @click="props.next">Next</button>
      <button v-if="props.end" :disabled="disableButton"  id="finish" class="btn btn-primary object-right justify-end" @click="finishBtn(newPoolName, newVDevs)">Finish</button>
  </div>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import { createPool } from "../../scripts/pools";

interface WizardButtonsProps {
  next: any;
  prev: any;
  end: boolean;
  disableButton: boolean;
}

const notifications = inject<Ref<any>>('general_notifications');

const props = defineProps<WizardButtonsProps>();
const newPoolName = inject('new-pool-name');
const newVDevs = inject<Ref<newVDev[]>>('new-vdevs');
const disableButtonRef = ref(true);

function finishBtn(newPoolName, newVDevs) {
  // if (props.disableButton) {
	// 	notifications?.value.constructNotification('Validation Errors', `Your pool could not be created due to the following errors:\n- ${globalErrors.join('\n- ')}`, 'error');
	// 	disableButton = false;
	// 	return;
	// }
  createPool(newPoolName, newVDevs);
}

</script>