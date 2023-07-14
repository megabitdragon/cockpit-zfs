<template>
	<div class="text-default w-full">
		<button
			@click="toggleAccordion"
			class="flex items-center space-x-3"
			:aria-expanded="isOpen"
			:aria-controls="`collapse${uid}`"
		>
			<svg
				class="ml-2 w-3 transition-all duration-200 transform"
				:class="{
					'rotate-0': isOpen,
					'-rotate-90': !isOpen,
				}"
				fill="none"
				stroke="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 10"
				aria-hidden="true"
			>
				<path
					d="M15 1.2l-7 7-7-7"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>

			<slot name="title" />
		</button>

		<div v-show="isOpen" :id="`collapse${uid}`">
			<slot name="content" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';

interface AccordionProps {
	isOpen: boolean;
}

const props = defineProps<AccordionProps>();

const instance = getCurrentInstance();
const uid = instance?.uid ?? '';

const isOpen = ref(props.isOpen);

const toggleAccordion = () => {
	isOpen.value = !isOpen.value;
};
</script>
