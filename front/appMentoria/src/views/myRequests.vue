<template>
  <div
    class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col"
  >
    <div class="flex-grow mt-20 mb-40">
      <viewMyRequests></viewMyRequests>
    </div>
  </div>
</template>
  
  <script setup>
import viewMyRequests from "@/components/viewMyRequests.vue";
</script>