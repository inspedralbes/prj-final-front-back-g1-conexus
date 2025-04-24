<template>
    <div class="technicians-container">
      <h1>Technicians Dashboard</h1>
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'TechniciansIndex'
  };
  </script>
  
  <style scoped>
  .technicians-container {
    padding: 20px;
  }
  </style>