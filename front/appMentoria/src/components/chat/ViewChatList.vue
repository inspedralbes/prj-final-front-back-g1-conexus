<template>
  <div>
    <button @click="$router.push({ path: '/newSingleChat'})" class="btn btn-primary">Crear Chat Privat</button>
    <button @click="$router.push({ path: '/newGroupChat'})" class="btn btn-primary">Crear Chat Grupal</button>
    <div
      v-if="chats.length === 0 && chatsInfo"
      class="flex items-center justify-center h-full"
    >
      <p class="text-gray-500">No hi tens chats</p>
    </div>
    <div v-if="!chatsInfo" class="flex items-center justify-center h-full">
      <p class="text-gray-500">Error</p>
    </div>
    <div v-else class="overflow-auto">
      <ViewChat :chats="chats" :users="users" />
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import ViewChat from "@/components/chat/viewInfoChat.vue";
import socketChat from "@/services/socketsScripts/socketChat";
import { useAppStore } from "@/stores/index";
import { getUsers } from "@/services/communicationsScripts/mainManager";
import { fetchChats } from "@/services/communicationsScripts/chatManager";

const users = ref([]);
const chats = ref([]);
const chatsInfo = ref(false);

const myUser = useAppStore().getUser();
const userId = myUser.id;

const fetchChatsNow = async (userId) => {
  try {
    const result = await fetchChats(userId);
    chats.value = result.chats;
    chatsInfo.value = result.chatsInfo;
    chats.value = chats.value.filter(chat => {
      if (chat.users[0] === userId || (chat.users.includes(userId) && chat.interactions && chat.interactions.length > 0)) {
      return true;
      }
      return false;
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
  }
};

onMounted(async () => {
  console.log("ViewChatList mounted");
  users.value = await getUsers();
  
  // Unirse a la room del usuario
  socketChat.emit("joinRoom", userId);

  socketChat.on("receiveMessage", (newMessage) => {
    console.log("ruben es un pedazo de maricon")
    fetchChatsNow(userId);
  });
  
  await fetchChatsNow(userId);
});

watch(chats, (newChats) => {
  console.log("Chats actualizados", newChats);
});
</script>