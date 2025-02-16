<template>
  <div class="flex flex-col min-h-screen">
    <NavBarWeb
      class="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 lg:block"
    ></NavBarWeb>
    <NavBarApp class="fixed bottom-0 left-0 right-0 w-full lg:hidden">
    </NavBarApp>
    <main class="flex-grow p-4">
      <h1 class="py-5 text-4xl font-bold text-textThemeColor">
        Crear Nueva Grupo
      </h1>
      <div class="border-buttonColorPrimary border-2 p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2 rounded-md">Llista de usuaris</h2>

        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar usuario..."
          class="mb-4 p-2 border rounded w-full text-textThemeColor bg-bgTheme"
        />
        <div
          v-if="list.length > 1"
          class="flex justify-center items-center mb-4"
        >
          <button
            @click="createGroupChat(list)"
            class="py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-buttonColorPrimary text-textThemeColor hover:bg-buttonColorSecondary transition"
          >
            Crear Chat Grupal
          </button>
        </div>
        <ul>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li
              v-for="user in filteredUsers"
              :key="user.id"
              :class="{
                'border-2 border-buttonColorTertiary': list.find(
                  (item) => item.id === user.id
                ),
              }"
              class="mb-1 flex items-center p-2 rounded"
              @click="addList(user.id)"
            >
              <img
                :src="updateProfile(user.id)"
                alt="User Photo"
                class="w-10 h-10 rounded-full mr-2 cursor-pointer bg-buttonColorPrimary"
              />
              <span>{{ user.name }}</span>
            </li>
          </div>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/index";
import {
  chatButton,
  fetchChats,
} from "../services/communicationsScripts/chatManager.js";
import { getUsers } from "../services/communicationsScripts/mainManager.js";
import NavBarApp from "@/components/navBar/NavBarApp.vue";
import Header from "@/components/Header.vue";
import NavBarWeb from "@/components/navBar/NavBarWeb.vue";

const BACK_URL = import.meta.env.VITE_URL_BACK;
const users = ref([]);
const searchQuery = ref("");
const chats = ref([]);
const list = ref([]);
const chatsInfo = ref(false);

const myUser = useAppStore().getUser();
const userId = myUser.id;

const router = useRouter();

const addList = (userId) => {
  console.log("addList", userId);
  const user = users.value.find((user) => user.id === userId);
  if (user.id === userId) {
    const index = list.value.findIndex((item) => item.id === userId);
    if (index !== -1) {
      list.value.splice(index, 1);
    } else {
      list.value.push(user);
    }
  }
};

const fetchChatsNow = async (userId) => {
  try {
    const result = await fetchChats(userId);
    chats.value = result.chats;
    chatsInfo.value = result.chatsInfo;
    chats.value = chats.value.filter((chat) => {
      if (
        chat.users[1] === userId &&
        (!chat.interactions || chat.interactions.length === 0)
      ) {
        return false;
      }
      return true;
    });
  } catch (error) {}
};

const updateProfile = (userId) => {
  const user = users.value.find((user) => user.id === userId);
  if (user && user.profile) {
    if (user.profile.startsWith("/")) {
      return `${BACK_URL}${user.profile}`;
    }
    return user.profile;
  }
  return BACK_URL + "/upload/profile_default.png";
};

const createGroupChat = (users) => {
  const userNames = users.map((user) => user.name).join(", ");
  const confirmation = confirm(
    `Vols iniciar una nova conversa amb: "${userNames}"?`
  );
  if (confirmation) {
    const name = prompt("Nom del chat:");
    console.log("name", name);
    const usersChats = [myUser.id, ...users.map((user) => user.id)];
    console.log("usersChats", usersChats);
    chatButton(name, usersChats, router);
  }
};

const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(async () => {
  users.value = await getUsers();
  await fetchChatsNow(userId);
});
</script>