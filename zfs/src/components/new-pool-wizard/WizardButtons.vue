<template>
   <div class="button-group-row">
      <button id="back" class="btn btn-secondary object-left justify-start" @click="props.prev">Back</button>
      <button id="next" class="btn btn-primary object-right justify-end" @click="props.next" >Next</button>
  </div>
</template>

<script setup lang="ts">
interface WizardButtonsProps {
  next: any;
  prev: any;
}

const props = defineProps<WizardButtonsProps>();
</script>