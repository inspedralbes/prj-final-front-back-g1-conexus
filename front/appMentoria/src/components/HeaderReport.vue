<template>
    <div class="flex justify-center mt-12">
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 class="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
            {{ $t("headerReport.title") }}
        </h2>
        <div class="flex justify-center space-x-4">
          <button
            @click="$router.push('/reportUserPage')"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            {{ $t("headerReport.reportUser") }}
          </button>
            <button
            @click="$router.push('/reportPublicacioPage')"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
          {{ $t("headerReport.reportPost") }}
          </button>  
          <button
            @click="$router.push('/reportCommentsPage')"
            class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
          {{ $t("headerReport.reportComment") }}
          </button>
        </div>
      </div>
    </div>
  </template>
  