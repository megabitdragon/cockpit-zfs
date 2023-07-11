<template>
	<div class="divide-y divide-default overflow-hidden rounded-lg bg-default shadow">
		<div class="px-4 py-5 sm:px-6">
			<slot name="title"/>
		</div>
		<div class="px-4 py-5 sm:p-6">
			<slot name="content"/>
		</div>
		<div class="px-4 py-4 sm:px-6">
			<slot name="footer"/>
		</div>
	</div>
</template>

<script setup lang="ts">


</script>