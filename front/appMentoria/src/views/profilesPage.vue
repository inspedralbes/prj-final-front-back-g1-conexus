<template>
    <div class="flex flex-col min-h-screen">
        <Header class="fixed top-0 left-0 right-0 z-10"></Header>
        <main class="flex-grow mt-16 mb-60">
            <viewPeopleMentoriaList></viewPeopleMentoriaList>
        </main>
        <NavBar></NavBar>
    </div>
</template>

<script setup>
import NavBar from '@/components/navBar/NavBarApp.vue';
import Header from '@/components/Header.vue';
import viewPeopleMentoriaList from '@/components/viewPeopleMentoriaList.vue';
</script>