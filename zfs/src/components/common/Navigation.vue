<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
      <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm">
        <option v-for="item in props.navigationItems" :key="item.name" :selected="item.current">{{ item.name }}</option>
      </select>
    </div>
    <!--^^^ Mobile or very small screen ^^^-->

    <!--vvv Desktop/Regular version vvv-->
    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex justify-center" aria-label="Tabs">
          <a v-for="item in props.navigationItems" :key="item.name"
										@click.prevent="navigationCallback(item)"
										:class="[item.current ? 'border-slate-500 text-slate-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
        </nav>
      </div>
    </div>

  
  </div>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from 'vue';

interface NavigationProps {
    show: boolean;
    navigationItems: NavigationItem[];
    currentNavigationItem?: NavigationItem;
    navigationCallback: NavigationCallback;
}

const props = defineProps<NavigationProps>();

</script>