<template>
    <div class="flex justify-center mt-12">
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 class="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
            Report Page
        </h2>
        <div class="flex justify-center space-x-4">
          <button
            @click="$router.push('/validation')"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Validation User
          </button>
            <button
            @click="$router.push('/validationInfo')"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Validation Update Info
          </button>  
        </div>
      </div>
    </div>
  </template>
  