<template>
    <div class="flex flex-col min-h-screen">
        <NavBarWeb class="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 lg:block"></NavBarWeb>
        <NavBarApp 
        class="fixed bottom-0 left-0 right-0 w-full lg:hidden ">
        </NavBarApp>
        <main class="flex-grow mt-16 mb-60">
        <NotificationList></NotificationList>
        </main>
    </div>
</template>

<script setup>
import NavBarApp from "@/components/navBar/NavBarApp.vue";
import NotificationList from '@/components/NotificationList.vue';
import NavBarWeb from "@/components/navBar/NavBarWeb.vue";

</script>