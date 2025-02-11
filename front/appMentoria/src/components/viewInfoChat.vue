<template>
  <div>
    <div
      v-if="selectedChatId === false"
      v-for="chat in chats"
      :key="chat._id"
      class="chat-item overflow-y-auto"
    >
        <div
          style="display: flex; align-items: center"
          @click="selectChat(chat._id)"
        >
          <img
            v-if="chat.users[0].value === userId.value"
            :src="getAuthorProfile(chat.users[1])"
            alt=""
            class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
          />
          <img
            v-if="chat.users[1].value === userId.value"
            :src="getAuthorProfile(chat.users[0])"
            alt=""
            class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
          />
          <div style="margin-left: 1rem">
            <h3 v-if="chat.users[0].value === userId.value">
              {{ getAuthorName(chat.users[1]) }}
            </h3>
            <h3 v-if="chat.users[1].value === userId.value">
              {{ getAuthorName(chat.users[0]) }}
            </h3>
            <p
              v-if="
                chat.interactions &&
                chat.interactions.length > 0 &&
                chat.interactions[chat.interactions.length - 1].message !== null
              "
            >
              {{ chat.interactions[chat.interactions.length - 1].message }}
            </p>
        </div>
      </div>
    </div>
    <viewChatContent
      v-if="selectedChatId !== false"
      :chatData="chats.find((chat) => chat._id === selectedChatId)"
      :users="users"
      :BACK_URL="BACK_URL"
      @closeChat="selectedChatId = false"
      class="overlay"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { defineProps } from "vue";
import viewChatContent from "./viewChatContent.vue";
import { useAppStore } from "@/stores/index";

const props = defineProps({
  chats: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});

const appStore = useAppStore();
const myUser = appStore.getUser();
const userId = ref(myUser.id);

const users = ref(props.users);
const chats = ref(props.chats);

const BACK_URL = import.meta.env.VITE_URL_BACK;

watch(
  () => props.users,
  (newUsers) => {
    users.value = newUsers;
  }
);

watch(
  () => props.chats,
  (newChats) => {
    chats.value = newChats;
  }
);

const selectedChatId = ref(false);

const selectChat = (chatId) => {
  selectedChatId.value = chatId;
  console.log("adasdasd",chatId);
  console.log("sali", selectedChatId.value);
};

const getAuthorName = (userId) => {
  console.log("getAuthorName", userId);
  const user = users.value.find((user) => user.id === userId);
  return user.name;
};

const getAuthorProfile = (userId) => {
  console.log("getAuthorProfile", userId);
  try {
    const user = users.value.find((user) => user.id === userId);
    let profileimage;
    if (user.profile.startsWith("/")) {
      profileimage = `${import.meta.env.VITE_URL_BACK}${user.profile}`;
    } else {
      profileimage = user.profile;
    }
    return profileimage;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  selectedChatId.value = false;
  console.log("ViewChatList mounted");
});
</script>

<style scoped>
.chat-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin: 10px;
  cursor: pointer;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 10;
}
</style>