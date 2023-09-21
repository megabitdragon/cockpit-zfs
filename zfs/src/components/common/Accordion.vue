<template>
	<div class="grid text-default w-full" :class="[props.gridSize]">
		<button @click="toggleAccordion" class="btn flex justify-center items-center w-full h-full border border-default" :class="[props.btnColSpan, props.btnColor]" :aria-expanded="isOpen" :aria-controls="`collapse${uid}`">
			<svg class="w-4 transition-all duration-200 transform" :class="{ 'rotate-0': isOpen, '-rotate-90': !isOpen, }" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" aria-hidden="true" >
				<path d="M15 1.2l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
		<div :class="[props.titleColSpan]">
			<slot name="title" />
		</div>
		

		<div v-show="isOpen" :id="`collapse${uid}`" :class="[props.contentColSpan]">
			<slot name="content" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';

interface AccordionProps {
	isOpen: boolean;
	gridSize: string;
	btnColSpan: string;
	btnColor: string;
	titleColSpan: string;
	contentColSpan: string;
}

const props = defineProps<AccordionProps>();

const instance = getCurrentInstance();
const uid = instance?.uid ?? '';

const isOpen = ref(props.isOpen);

const toggleAccordion = () => {
	isOpen.value = !isOpen.value;
};
</script>
