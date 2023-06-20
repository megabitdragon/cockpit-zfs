<template>
   <div class="button-group-row">
      <button id="back" class="btn btn-secondary object-left justify-start" @click="props.prev">Back</button>
      <button v-if="!props.end" id="next" class="btn btn-primary object-right justify-end" @click="props.next">Next</button>
      <button v-if="props.end" id="finish" class="btn btn-primary object-right justify-end" @click="finishBtn(newPoolName, newVDevs)">Finish</button>
  </div>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import { createPool } from "../../scripts/pools";

interface WizardButtonsProps {
  next: any;
  prev: any;
  end: boolean;
}

const props = defineProps<WizardButtonsProps>();

const newPoolName = inject<Ref>('new-pool-name');
const newVDevs = inject<Ref<newVDev[]>>('new-vdevs');

function finishBtn(newPoolName, newVDevs) {
  console.log(createPool(newPoolName, newVDevs));
}

</script>