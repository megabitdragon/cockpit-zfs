<template>
	<nav class="max-w-full mx-auto" aria-label="Pool Creation Progress">
		<ol role="list" class="divide-y divide-default rounded-md border border-default md:flex md:divide-y-0">
			<li v-for="(step, stepIdx) in props.navigationItems" :key="step.id" class="relative overflow-hidden lg:flex-1">
				<a v-if="step.status === 'completed'" @click.prevent="navigationCallback(step)" class="group flex w-full items-center">
					<span class="flex items-center px-2 py-4 text-sm font-medium">
						<span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent group-hover:bg-slate-500 dark:group-hover:border-slate-600">
							<CheckCircleIcon class="h-6 w-6 text-default" aria-hidden="true" />
						</span>
						<span class="ml-1.5 text-sm font-medium text-default">{{ step.name }}</span>
					</span>
				</a>
				<a v-else-if="step.status === 'current'" @click.prevent="navigationCallback(step)" class="flex items-center px-2 py-4 text-sm font-medium" aria-current="step">          
						<span class="flex h-8 w-8 aspect-square items-center justify-center rounded-full border-2 border-green-600">
							<span class="text-success">{{ step.id }}</span>
						</span>
						<span class="ml-1.5 text-sm font-medium text-default">{{ step.name }}</span>
				</a>
				<a v-else @click.prevent="navigationCallback(step)" class="group flex items-center">
					<span class="flex items-center px-2 py-4 text-sm font-medium">
						<span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-default group-hover:border-gray-400 dark:group-hover:border-gray-600">
							<span class="text-secondary group-hover:text-default">{{ step.id }}</span>
						</span>
						<span class="ml-1.5 text-sm font-medium text-secondary group-hover:text-default">{{ step.name }}</span>
					</span>
				</a>
				<template v-if="stepIdx !== props.navigationItems.length - 1">
					<!-- Arrow separator for lg screens and up -->
					<div class="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
						<svg class="h-full w-full text-muted" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
							<path d="M0 -2L20 40L0 82" vector-effect="non-scaling-stroke" stroke="currentcolor" stroke-linejoin="round" />
						</svg>
					</div>
				</template>
			</li>
		</ol>
	</nav>
	
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
import { StepsNavigationItem, StepNavigationCallback } from '../../types';

interface WizardTabsProps {
	show: boolean;
	navigationItems: StepsNavigationItem[];
	currentNavigationItem?: StepsNavigationItem;
	navigationCallback: StepNavigationCallback;
}

const props = defineProps<WizardTabsProps>();

</script>