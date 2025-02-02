<template>
  <div class="flex flex-col min-h-screen">
    <Header class="fixed top-0 left-0 right-0 z-10"></Header>
    <main class="flex-grow mt-16">
      <ViewChatList></ViewChatList>
    </main>
    <NavBar></NavBar>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import Header from '@/components/Header.vue';
import ViewChatList from '@/components/chat/ViewChatList.vue';
</script>