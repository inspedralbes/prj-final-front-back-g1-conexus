<template>
  <div
    class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col"
  >
    <div class="flex-grow mt-20 mb-40">
      <viewMyPublications></viewMyPublications>
    </div>
  </div>
  <NavBar></NavBar>
</template>

<script setup>
import Header from "@/components/Header.vue";
import NavBar from "@/components/navBar/NavBarApp.vue";
import viewMyPublications from "@/components/viewMyPublications.vue";
</script>