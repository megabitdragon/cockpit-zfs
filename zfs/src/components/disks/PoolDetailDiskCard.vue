<template>
	<Card :bgColor="'bg-default'" :titleSection="true" :contentSection="true" :footerSection="true"
		class="mt-2 mb-4 overflow-visible card bg-default" :title="props.disk.name">
		<template v-slot:title>
			<div class="flex flex-row justify-between gap-1">
				<div class="pr-2 text-default text-medium" :class="truncateText" :title="props.disk.name">
					{{ props.disk.name }}
				</div>
				<div class="px-1">
					<CheckCircleIcon class="aspect-square w-5 h-5 text-green-400" />
				</div>
			</div>

		</template>
		<!-- alias, name, model/serial, temp, status -->
		<template v-slot:content>
			<div>
				<p>({{ props.disk.type }})</p>
				<span class="text-success">{{ props.disk.health }}</span>
			</div>
			<div>
				<span class="text-default">{{ props.disk.temp }}&nbsp;</span>
			</div>
		</template>
		<template v-slot:footer>
			<div class="text-default">
				<b>Total: {{ props.disk.capacity }}</b>
			</div>
		</template>
	</Card>

</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
import {inject, Ref} from 'vue';
import Card from '../common/Card.vue';
import { DiskData } from '@45drives/houston-common-lib';

interface PoolDetailDiskCardProps {
	disk: DiskData;
}

const truncateText = inject<Ref<string>>('style-truncate-text')!;

const props = defineProps<PoolDetailDiskCardProps>();

</script>