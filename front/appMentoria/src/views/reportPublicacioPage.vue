<template>
  <div class="bg-bgTheme text-textThemeColor min-h-screen flex flex-col">
    <div class="flex-grow mt-20 mb-40">
      <HeaderReport class="mb-8"></HeaderReport>
      <ViewReportPublicacio></ViewReportPublicacio>
    </div>
  </div>
</template>

<script setup>
import ViewReportPublicacio from "@/components/viewReportPublicacio.vue";
import HeaderReport from "@/components/HeaderReport.vue";
</script>