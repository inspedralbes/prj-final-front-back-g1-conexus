<template>
    <div class="relative">
      <Header class="fixed top-0 left-0 right-0 z-20 shadow-md"></Header>  
      <div class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col pt-20 pb-20">
        <div class="container mx-auto px-4">
          <HeaderReport class="mb-8"></HeaderReport>
        </div>
      </div>
  
      <NavBar class="fixed bottom-0 left-0 right-0 z-20 shadow-md bg-white dark:bg-gray-800"></NavBar>
    </div>
  </template>
  
  <script setup>
  import Header from '@/components/Header.vue';
  import HeaderReport from '@/components/HeaderReport.vue';
  import NavBar from '@/components/navBar/NavBarApp.vue';
  </script>
  