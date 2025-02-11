<template>
  <Header class="fixed top-0 left-0 right-0 z-10"></Header>
  <div
    class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col"
  >
    <div class="flex-grow mt-20 mb-40">
      <HeaderReport class="mb-8"></HeaderReport>
      <ViewReportPublicacio></ViewReportPublicacio>
    </div>
  </div>
  <NavBar></NavBar>
</template>

<script setup>
import Header from "@/components/Header.vue";
import NavBar from "@/components/navBar/NavBarApp.vue";
import ViewReportPublicacio from "@/components/viewReportPublicacio.vue";
import HeaderReport from "@/components/HeaderReport.vue";
</script>