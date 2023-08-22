<template>
	<div class="divide-y divide-default overflow-hidden rounded-lg bg-default shadow">
		<div class="px-3 py-3 sm:px-6">
			<slot name="title"/>
		</div>
		<div class="px-3 py-3 sm:p-6">
			<slot name="content"/>
		</div>
		<div class="px-3 py-3 sm:px-6">
			<slot name="footer"/>
		</div>
	</div>
</template>

<script setup lang="ts">


</script>