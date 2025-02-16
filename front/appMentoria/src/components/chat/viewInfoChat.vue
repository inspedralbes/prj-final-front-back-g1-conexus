<template>
    <div>
      <div
        v-if="selectedChatId === false"
        v-for="chat in chats"
        :key="chat._id"
        class="chat-item overflow-y-auto "
      >
          <div
            style="display: flex; align-items: center"
            @click="selectChat(chat._id)"
          >
          <div v-if="chat.users.length > 2">
            <h3>{{ chat.name }}</h3>
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
            <div v-else style="display: flex; align-items: center">
            <img
              :src="getAuthorProfile(chat.users[0] === userId ? chat.users[1] : chat.users[0])"
              alt="Profile Image"
              style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px"
            />
            <div>
              <h3 v-if="chat.users[0] === userId">
              {{ getAuthorName(chat.users[1]) }}
              </h3>
              <h3 v-else>
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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { defineProps } from "vue";
import viewChatContent from "@/components/chat/viewChatContent.vue";
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
};

const getAuthorName = (userId) => {
  const user = users.value.find((user) => user.id === userId);
  return user.name;
};

const getAuthorProfile = (userId) => {
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