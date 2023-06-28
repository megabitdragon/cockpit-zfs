<template>
  <Card class="mt-2 mb-4">
    <template v-slot:title>
     
    </template>
    <template v-slot:content>
    
    </template>
    <template v-slot:footer>
  
    </template>
  </Card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide } from 'vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Card from '../common/Card.vue';

interface PoolCardProps {
  name: string,
  status: string,
  capacity: number,
  size: string,
  free: string;
  allocated: string;
}

const props = defineProps<PoolCardProps>();

</script>