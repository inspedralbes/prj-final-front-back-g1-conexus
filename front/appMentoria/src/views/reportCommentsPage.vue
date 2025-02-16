<template>
  <div class="bg-bgTheme text-textThemeColor min-h-screen flex flex-col">
    <div class="flex-grow mt-20 mb-40">
      <HeaderReport class="mb-8"></HeaderReport>
      <ViewReportComments></ViewReportComments>
    </div>
  </div>
</template>

<script setup>
import ViewReportComments from "@/components/viewReportComments.vue";
import HeaderReport from "@/components/HeaderReport.vue";
</script>