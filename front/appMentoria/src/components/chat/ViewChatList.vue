<template>
  <div class="bg-bgTheme h-full flex flex-col md:flex-row">
    
    <!-- Sidebar en escritorio y tablet | Botones en la parte superior en móvil -->
    <div class="p-4 border-b border-buttonColorPrimary md:border-r md:border-b-0 md:w-1/3 lg:w-1/4">
      <div class="flex gap-2 md:flex-col">
        <button 
          @click="$router.push({ path: '/newSingleChat' })" 
          class="py-2 px-10 bg-containersTheme border border-buttonColorPrimary w-full">
          Crear Chat Privat
        </button>
        <button 
          @click="$router.push({ path: '/newGroupChat' })" 
          class="py-2 px-6 bg-containersTheme border border-buttonColorPrimary w-full">
          Crear Chat Grupal
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="flex-grow px-4 py-4 max-w-screen-lg mx-auto">
      <div v-if="chats.length === 0 && chatsInfo" class="flex items-center justify-center h-full">
        <p class="text-textThemeColor">No hi tens chats</p>
      </div>
      <div v-if="!chatsInfo" class="flex items-center justify-center h-full">
        <p class="text-textThemeColor">Error</p>
      </div>
      <div v-else class="overflow-auto">
        <ViewChat :chats="chats" :users="users" />
      </div>
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
    fetchChatsNow(userId);
  });
  
  await fetchChatsNow(userId);
});

watch(chats, (newChats) => {
  console.log("Chats actualizados", newChats);
});
</script>