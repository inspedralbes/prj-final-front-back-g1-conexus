<template>
    <div class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <div class="flex-grow mt-20 mb-40">
            <HeaderReport class="mb-8"></HeaderReport>
            <viewReportUser></viewReportUser>
        </div>
    </div>
    <NavBar></NavBar>
</template>

<script setup>
import NavBar from '@/components/navBar/NavBarApp.vue';
import viewReportUser from '@/components/viewReportUser.vue';
import HeaderReport from '@/components/HeaderReport.vue';
</script>