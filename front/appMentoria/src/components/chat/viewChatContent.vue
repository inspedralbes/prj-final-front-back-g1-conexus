<template>
  <div class="flex flex-col h-screen z-3000 relative">
    <div
      class="flex sm:items-center justify-between py-2 border-b-2 border-buttonColorTertiary bg-bgTheme"
    >
      <div class="relative flex items-center space-x-4">
        <div class="relative ps-5">
          <img
            v-if="chatPersons === 2"
            :src="updateProfile(otherUser)"
            alt=""
            class="w-10 sm:w-16 h-10 sm:h-16 rounded-full bg-buttonColorPrimary"
          />
        </div>
        <div class="flex flex-col leading-tight">
          <div class="text-2xl mt-1 flex items-center">
            <span v-if="chatPersons === 2" class="text-textThemeColor mr-3">{{
              otherUser.name
            }}</span>
            <span v-if="chatPersons > 2" class="text-textThemeColor mr-3">{{
              chatName
            }}</span>
          </div>
          <span v-if="chatPersons === 2" class="text-lg text-textThemeColor">{{
            otherUser.email.split("@")[0]
          }}</span>
          <span v-if="chatPersons > 2" class="text-lg text-textThemeColor">{{
            nameUsersChat
          }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-2 pr-4">
        <button
          @click="$emit('closeChat')"
          type="button"
          class="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out text-buttonColorPrimary hover:bg-gray-300 focus:outline-none"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div
      id="messages"
      ref="messageContainer"
      class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex-grow h-full bg-containersTheme"
    >
      <div
        v-for="(interaction, index) in interactions"
        :key="index"
        class="chat-message"
      >
        <div
          :class="
            Number(interaction.userId) === currentUser
              ? 'flex items-end justify-end'
              : 'flex items-end'
          "
        >
          <div
            :class="
              Number(interaction.userId) === currentUser
                ? 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end'
                : 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start'
            "
          >
            <div>
              <span
                :class="
                  Number(interaction.userId) === currentUser
                    ? 'px-4 py-2 rounded-lg inline-block rounded-br-none bg-buttonColorPrimary text-textThemeColor'
                    : 'px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600'
                "
              >
                <p
                  v-if="
                    Number(interaction.userId) !== currentUser &&
                    chatPersons > 2
                  "
                >
                  <strong>{{
                    users.find((user) => user.id === Number(interaction.userId))
                      .name
                  }}</strong>
                </p>
                <p>{{ interaction.message }}</p>
                <p>
                  <small>{{
                    new Date(interaction.timestamp).toLocaleString()
                  }}</small>
                </p>
                <button
                  v-if="
                    Number(interaction.userId) !== currentUser &&
                    !isChatReported
                  "
                  @click="confirmReport(interaction)"
                  class="flex items-center space-x-1"
                >
                  <svg
                    fill="#4b5562"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#4b5562"
                    class="w-4 h-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.427-3.427A1.75 1.75 0 0111.164 17h9.586a.25.25 0 00.25-.25V4.25a.25.25 0 00-.25-.25H3.25zm-1.75.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 01-1.75 1.75h-9.586a.25.25 0 00-.177.073l-3.5 3.5A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25zM12 6a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0v-4A.75.75 0 0112 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    ></path>
                  </svg>
                  <p class="text-sm"><small>Report</small></p>
                </button>
              </span>
            </div>
          </div>
          <img
            :src="updateProfile(interaction.userId)"
            alt="Profile"
            class="w-6 h-6 rounded-full bg-buttonColorSecondary"
            :class="
              Number(interaction.userId) === currentUser ? 'order-2' : 'order-1'
            "
          />
        </div>
      </div>
    </div>

    <div
      class="border-t-2 border-buttonColorTertiary px-4 p-4 mb-2 sm:mb-0 bg-bgTheme"
    >
      <div class="relative flex">
        <template v-if="isChatReported">
          <input
            type="text"
            placeholder="Chat reportado, no puedes enviar mensajes."
            disabled
            class="w-full focus:outline-none text-gray-400 pl-5 pr-20 bg-gray-200 rounded-md py-3 dark:bg-gray-800 dark:text-gray-400"
          />
        </template>

        <template v-else>
          <input
            ref="messageInput"
            type="text"
            placeholder="Write your message!"
            class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-20 bg-gray-200 rounded-md py-3"
          />
          <div class="absolute right-0 items-center inset-y-0 flex">
            <button
              @click="sendMessageInMongoNow"
              type="button"
              class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-bgTheme hover:bg-gray-300 focus:outline-none mr-4"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#999999"
              >
                <path
                  d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z"
                  stroke="#999999"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, onUnmounted, watch, nextTick } from "vue";
import {
  fetchMessages,
  sendMessageInMongo,
  reportChatMongo,
} from "@/services/communicationsScripts/chatManager";
import { reportChat } from "@/services/communicationsScripts/mainManager";
import socketChat from "@/services/socketsScripts/socketChat";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/index";

const router = useRouter();
const props = defineProps({
  chatData: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  BACK_URL: {
    type: String,
    required: true,
  },
});

const appStore = useAppStore();
const myUser = appStore.getUser();
const currentUser = ref(myUser.id);

const users = ref(props.users);

const BACK_URL = props.BACK_URL;

const chatData = ref(props.chatData);
const chatPersons = Number(chatData.value.users.length);
const chatName = String(chatData.value.name);

const nameUsersChat =
  chatData.value.users.length > 3
    ? chatData.value.users
        .slice(0, 3)
        .map((userId) => users.value.find((user) => user.id === userId).name)
        .join(", ") + "..."
    : chatData.value.users
        .map((userId) => users.value.find((user) => user.id === userId).name)
        .join(", ");

const interactions = ref([]);
const isChatReported = ref(false);

const messageContainer = ref(null);
const messageInput = ref(null);

const otherUserId = ref(
  chatData.value.users.find((userId) => userId !== currentUser.value)
);

const otherUser = ref(
  users.value.find((user) => user.id === otherUserId.value)
);

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const joinRoom = (roomId) => {
  socketChat.emit("joinRoom", roomId);
};

const leaveRoom = (roomId) => {
  socketChat.emit("leaveRoom", roomId);
};

const sendMessageInMongoNow = () => {
  const message = messageInput.value.value;
  if (message) {
    sendMessageInMongo(chatData.value, currentUser, message, users);
    messageInput.value.value = "";
  }
};

const updateProfile = (userId) => {
  const user = users.value.find((user) => user.id === userId);

  if (user && user.profile) {
    if (user.profile.startsWith("/")) {
      return `${BACK_URL}${user.profile}`;
    }
    return user.profile;
  }

  // Devuelve una imagen por defecto si no hay perfil
  return BACK_URL + "/upload/profile_default.png"; // Cambia esta URL a la que prefieras.
};

onMounted(async () => {
  console.log("ViewChatContent mounted");
  scrollToBottom();
  joinRoom(chatData.value._id);
  socketChat.on("receiveMessage", (message) => {
    console.log("Received message:", message);
    interactions.value.push(message);
    scrollToBottom();
  });

  console.log("Fetching chat data for chat ID:", chatData.value._id);
  chatData.value = await fetchMessages(chatData.value._id);
  interactions.value = chatData.value._rawValue.interactions;
  scrollToBottom();
  console.log("Chat data fetched:", users.value);
  if (chatData.value._rawValue.reports === 1) {
    isChatReported.value = true;
  }
});
watch(interactions, () => {
  scrollToBottom();
});

onUnmounted(() => {
  leaveRoom(chatData.value._id);
});

const confirmReport = async (interaction) => {
  console.log("Interaction object:", interaction);

  const reason = prompt(
    `Estàs segur que vols reportar aquest missatge: "${interaction.message}"? Si és així, indica el motiu:`
  );

  console.log("Reporting message with the following details:", {
    message_id: interaction._id,
    user_id: interaction.userId,
    message: interaction.message,
    reason: reason,
  });

  if (reason) {
    try {
      const response = await reportChat(
        interaction._id,
        interaction.userId,
        interaction.message,
        reason
      );
      const result = await reportChatMongo(props.chatData._id, interaction._id);
      if (result.error || response.error) {
        console.error(
          "Error reporting message:",
          result.error || response.error
        );
      } else {
        console.log("Message reported successfully!");
        isChatReported.value = true;
      }
    } catch (error) {
      console.error("Error reporting message:", error);
    }
  }
};
</script>