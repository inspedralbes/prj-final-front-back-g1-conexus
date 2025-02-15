<template>
    <div class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <div class="flex-grow mt-20 mb-40">
            <HeaderReport class="mb-8"></HeaderReport>
            <ViewReportComments></ViewReportComments>
        </div>
    </div>
</template>

<script setup>
import ViewReportComments from '@/components/viewReportComments.vue';
import HeaderReport from '@/components/HeaderReport.vue';
</script>