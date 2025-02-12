<template>
    <div class="flex flex-col min-h-screen">
        <Header class="fixed top-0 left-0 right-0 z-10"></Header>
        <main class="flex-grow my-20 p-4">
            <div>
                <h2 class="text-lg font-semibold mb-2 rounded-md">Llista de usuaris</h2>

                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Buscar usuario..." 
                    class="mb-4 p-2 border rounded w-full"
                />
                <div v-if="list.length > 1" class="flex justify-center mb-4">
                    <button @click="createGroupChat(list)" class="btn btn-primary">Crear Chat Grupal</button>
                </div>
                <ul>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <li v-for="user in filteredUsers" :key="user.id" 
                            :class="{'border-2 border-green-500': list.find(item => item.id === user.id)}" 
                            class="mb-1 flex items-center p-2 rounded" 
                            @click="addList(user.id)">
                            <img :src="updateProfile(user.id)" alt="User Photo"
                                class="w-10 h-10 rounded-full border-2 border-gray-300 mr-2 cursor-pointer">
                            <span>{{ user.name }}</span>
                        </li>
                    </div>
                </ul>
            </div>
        </main>
        <NavBar></NavBar>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import NavBar from '@/components/NavBar.vue';
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';
import { useAppStore } from "@/stores/index";
import { chatButton, getUsers, fetchChats } from "../services/communicationManager";

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
    const user = users.value.find(user => user.id === userId);
    if(user.id === userId) {
        const index = list.value.findIndex(item => item.id === userId);
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
        chats.value = chats.value.filter(chat => {
            if (chat.users[1] === userId && (!chat.interactions || chat.interactions.length === 0)) {
                return false;
            }
            return true;
        });
    } catch (error) { }
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
    const userNames = users.map(user => user.name).join(", ");
    const confirmation = confirm(`Vols iniciar una nova conversa amb: "${userNames}"?`);
    if (confirmation) {
        const name = prompt("Nom del chat:");
        console.log("name", name);
        const usersChats = [myUser.id, ...users.map(user => user.id)];
        console.log("usersChats", usersChats);
        chatButton(name, usersChats, router);
    }
};

const filteredUsers = computed(() => {
    return users.value.filter(user =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

onMounted(async () => {
    users.value = await getUsers();
    await fetchChatsNow(userId);
});
</script>