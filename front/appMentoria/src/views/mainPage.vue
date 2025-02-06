<template>
  <div class="flex flex-col min-h-screen">
    <Header class="fixed top-0 left-0 right-0 z-10"></Header>
    <NavBarWeb class="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 lg:block"></NavBarWeb>
    <NavBarApp 
      class="fixed bottom-0 left-0 right-0 lg:hidden">
    </NavBarApp>
    <main class="flex-grow mt-16 mb-20 lg:ml-60 lg:mb-0"> 
      <ViewPostList></ViewPostList>
    </main>
  </div>
</template>


<script setup>
import NavBarApp from "@/components/navBar/NavBarApp.vue";
import Header from "@/components/Header.vue";
import ViewPostList from "@/components/ViewPostList.vue";
import NavBarWeb from "@/components/navBar/NavBarWeb.vue";
</script>