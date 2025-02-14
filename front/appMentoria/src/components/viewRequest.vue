<template>
  <div>
    <div
      v-if="loading"
      class="flex items-center justify-center min-h-screen bg-backgroundLight dark:bg-backgroundDark"
    >
      <Loading />
    </div>

    <div v-else>
      <div
        v-if="selectedrequest"
        class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 dark:bg-gray-900"
      >
        <button
          @click="goMain"
          class="py-2 px-4 fixed top-0 left-0 mt-3 ml-4 z-20"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z"
                fill="#ffffff"
              ></path>
            </g>
          </svg>
        </button>
        <div
          v-if="
            selectedrequest.reports === 0 ||
            selectedrequest.text_ia === 0 ||
            selectedrequest.image_ia === 0
          "
        >
          <header class="flex items-center p-4 border-b">
            <img
              :src="getAuthorProfile(selectedrequest.user_id)"
              alt="Avatar"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 class="font-bold text-lg">
                {{ getAuthorName(selectedrequest.user_id) }}
              </h2>
              <p class="text-gray-500 text-sm dark:text-white mb-6">
                {{ getAuthorHandle(selectedrequest.user_id) }} ·
                {{ timeSince(selectedrequest.created_at) }}
              </p>
            </div>
          </header>

          <main class="p-4 space-y-4">
            <h1 class="text-xl font-bold">{{ selectedrequest.title }}</h1>
            <p
              class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300"
            >
              {{ selectedrequest.description }}
            </p>

            <div
              v-if="selectedrequest.image != null"
              class="rounded-lg overflow-hidden"
            >
              <img
                :src="`${employmentExchange_url}${selectedrequest.image}`"
                alt="request Image"
                class="w-full"
              />
            </div>
          </main>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-bold">{{ $t("viewRequest.coments") }}</h3>
          <div class="border-t-2 border-gray-200 px-4 p-4 mb-2 sm:mb-0">
            <div class="relative flex">
              <input
                ref="commentInput"
                type="text"
                placeholder="Escriu un comentari!"
                class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-20 bg-gray-200 rounded-md py-3 dark:bg-gray-800 dark:text-white"
              />
              <div class="absolute right-0 items-center inset-y-0 flex">
                <button
                  @click="sendCommentInMongo(null)"
                  type="button"
                  class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4"
                >
                  <svg
                    viewBox="0 -0.5 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14.734 15.8974L19.22 12.1374C19.3971 11.9927 19.4998 11.7761 19.4998 11.5474C19.4998 11.3187 19.3971 11.1022 19.22 10.9574L14.734 7.19743C14.4947 6.9929 14.1598 6.94275 13.8711 7.06826C13.5824 7.19377 13.3906 7.47295 13.377 7.78743V9.27043C7.079 8.17943 5.5 13.8154 5.5 16.9974C6.961 14.5734 10.747 10.1794 13.377 13.8154V15.3024C13.3888 15.6178 13.5799 15.8987 13.8689 16.0254C14.158 16.1521 14.494 16.1024 14.734 15.8974Z"
                        stroke="#999999"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <ul>
            <li
              v-for="comment in getCommentsWithrequestId(
                selectedrequest.id
              ).filter(
                (comment) =>
                  (!comment.commentReply_id && comment.reported === 0) ||
                  comment.text_ia === 0
              )"
              :key="comment.id"
              class="border-b py-2 flex items-start space-x-4 m-4"
            >
              <img
                :src="getAuthorProfile(comment.user_id)"
                alt="Avatar"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="font-bold">
                    {{ getAuthorName(comment.user_id) }}
                  </h4>
                  <span class="text-gray-500 text-sm">{{
                    timeSince(comment.created_at)
                  }}</span>
                </div>
                <p style="word-break: break-word">{{ comment.comment }}</p>
                <div
                  v-if="getCommentsInComments(comment.id).length"
                  class="ml-8 mt-2 space-y-2"
                >
                  <div
                    v-for="reply in getCommentsInComments(comment.id).filter(
                      (reply) => reply.reported === 0 || reply.text_ia === 0
                    )"
                    :key="reply.id"
                    class="flex items-start space-x-4 mb-4 mr-10"
                  >
                    <img
                      :src="getAuthorProfile(reply.user_id)"
                      alt="Avatar"
                      class="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div class="flex items-center space-x-2">
                        <h4 class="font-bold">
                          {{ getAuthorName(reply.user_id) }}
                        </h4>
                        <span class="text-gray-500 text-sm">{{
                          timeSince(reply.created_at)
                        }}</span>
                      </div>
                      <p style="word-break: break-word">{{ reply.comment }}</p>
                    </div>
                  </div>
                </div>
                <div class="relative flex mb-4 mr-5">
                  <input
                    type="text"
                    :placeholder="$t('viewRequest.comentPlaceholder')"
                    v-model="replyInputs[comment.id]"
                    class="w-3/4 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-3 pr-16 bg-gray-200 rounded-md py-2 dark:bg-gray-800 dark:text-white"
                    style="width: 100%"
                  />
                  <div class="absolute right-0 items-center inset-y-0 flex">
                    <button
                      @click="sendCommentInMongo(comment.id)"
                      type="button"
                      class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4"
                    >
                      <svg
                        viewBox="0 -0.5 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M14.734 15.8974L19.22 12.1374C19.3971 11.9927 19.4998 11.7761 19.4998 11.5474C19.4998 11.3187 19.3971 11.1022 19.22 10.9574L14.734 7.19743C14.4947 6.9929 14.1598 6.94275 13.8711 7.06826C13.5824 7.19377 13.3906 7.47295 13.377 7.78743V9.27043C7.079 8.17943 5.5 13.8154 5.5 16.9974C6.961 14.5734 10.747 10.1794 13.377 13.8154V15.3024C13.3888 15.6178 13.5799 15.8987 13.8689 16.0254C14.158 16.1521 14.494 16.1024 14.734 15.8974Z"
                            stroke="#999999"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-else
        v-for="request in requests.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )"
        :key="request.id"
        class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 dark:bg-gray-900"
      >
        <div v-if="request.reports === 0">
          <header class="flex items-center p-4 border-b">
            <img
              :src="getAuthorProfile(request.user_id)"
              alt="Avatar"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 class="font-bold text-lg">
                {{ getAuthorName(request.user_id) }}
              </h2>
              <p class="text-gray-500 text-sm dark:text-white">
                {{ getAuthorHandle(request.user_id) }} ·
                {{ timeSince(request.created_at) }}
              </p>
            </div>
          </header>

          <main class="p-4 space-y-4">
            <h1 class="text-xl font-bold">{{ request.title }}</h1>
            <p
              class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300"
            >
              {{ request.description }}
            </p>

            <div
              v-if="request.image != null"
              class="rounded-lg overflow-hidden"
            >
              <img
                :src="`${employmentExchange_url}${request.image}`"
                alt="request Image"
                class="w-full"
              />
              <button
                class="block mx-auto mt-2 px-2 py-2 text-sm text-blue-500 hover:text-blue-600 focus:outline-none"
                @click="toggleExpand(request.id)"
              >
                {{
                  expandedRequests.includes(request.id)
                    ? $t("viewRequest.seeLess")
                    : $t("viewRequest.seeMore")
                }}
              </button>
            </div>

            <!-- Mostrar disponibilidad cuando expandido -->
            <div v-if="expandedRequests.includes(request.id)" class="mt-6">
              <h2 class="text-lg font-semibold text-center text-white mb-4">
                {{ $t("viewRequest.availability") }}
              </h2>
              <div
                class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <p class="text-gray-800 dark:text-gray-300 text-center">
                  <span
                    v-for="(day, index) in parseAvailability(
                      request.availability
                    )"
                    :key="index"
                    class="block py-2 border-b border-gray-300 dark:border-gray-700"
                  >
                    <strong class="text-gray-900 dark:text-gray-200">{{
                      day.day
                    }}</strong>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ $t("viewRequest.from") }} {{ day.startTime }} {{ $t("viewRequest.to") }} {{ day.endTime }}
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </main>

          <footer class="p-4 border-t flex justify-between items-center">
            <div class="flex justify-around text-gray-500 dark:text-gray-300">
              <button
                class="flex items-center space-x-1 hover:text-gray-500"
                @click="showrequestWithComments(request)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                <span>{{ getCommentsWithrequestId(request.id).length }}</span>
              </button>
            </div>

            <!-- Botón "Ver más" -->
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { getUsers } from "@/services/communicationsScripts/mainManager";
import { getEmploymentExchangeComments, postEmploymentExchangeComments } from "@/services/communicationsScripts/employmentExchangeManager";
import socketBack from "../services/socketsScripts/socketBack.js";
import { useAppStore } from "@/stores/index";
import Loading from "@/components/Loading.vue"; // Import the Loading component

const employmentExchange_url = import.meta.env
  .VITE_URL_BACK_EMPLOYMENT_EXCHANGE;
const back_url = import.meta.env.VITE_URL_BACK;
const users = ref([]);
const comments = ref([]);
const selectedrequest = ref(null);
const loading = ref(true); // Add loading state
const commentLoading = ref(false); // Add comment loading state
const publicationLoading = ref(false); // Add publication loading state
const expandedRequests = ref([]);

const commentInput = ref(null);
const replyInputs = ref({});

var myUser = useAppStore().getUser();

const props = defineProps({
  requests: Array,
});

const toggleExpand = (id) => {
  const index = expandedRequests.value.indexOf(id);
  if (index > -1) {
    expandedRequests.value.splice(index, 1);
  } else {
    expandedRequests.value.push(id);
  }
};

// const parsedAvailability = JSON.parse(props.requests[0].availability).map(
//   (day) => {
//     return `${day.day} de ${day.start} a ${day.end}`;
//   }
// );

const getAuthorName = (userId) => {
  const user = users.value.find((user) => user.id === userId);
  return user.name;
};

const getAuthorHandle = (userId) => {
  const user = users.value.find((user) => user.id === userId);
  return user.email.split("@")[0];
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

const getCommentsWithrequestId = (requestId) => {
  const list = comments.value.filter(
    (comment) => comment.publication_id === requestId && comment.reported === 0
  );
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return list;
};

const getCommentsInComments = (commentid) => {
  return comments.value.filter(
    (comment) => comment.commentReply_id === commentid
  );
};

const sendCommentInMongo = async (ID) => {
  if (ID === null) {
    if (commentInput.value.value === "") return;
    const message = commentInput.value.value;
    const comment = {
      comment: message,
      user_id: myUser.id,
      publication_id: selectedrequest.value.id,
      commentReply_id: null,
      created_at: new Date().toISOString(),
    };
    await postEmploymentExchangeComments(comment);
    console.log(comment);
    socketBack.emit("newComment", comment);
    commentInput.value.value = "";
  } else {
    if (!replyInputs.value[ID]) return;
    const message = replyInputs.value[ID];
    const replyComment = {
      comment: message,
      user_id: myUser.id,
      publication_id: selectedrequest.value.id,
      commentReply_id: ID,
      created_at: new Date().toISOString(),
    };
    await postEmploymentExchangeComments(replyComment);
    socketBack.emit("newComment", replyComment);
    replyInputs.value[ID] = "";
  }
};

function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "anys", seconds: 31536000 },
    { label: "mesos", seconds: 2592000 },
    { label: "dies", seconds: 86400 },
    { label: "hores", seconds: 3600 },
    { label: "minuts", seconds: 60 },
    { label: "segons", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}`;
    }
  }
  return "ara mateix";
}

const showrequestWithComments = (request) => {
  selectedrequest.value = request;
};

function goMain() {
  selectedrequest.value = null;
}

const parseAvailability = (availability) => {
  // Si availability es una cadena, la parseamos
  if (typeof availability === "string") {
    try {
      // Parseamos la cadena JSON y devolvemos los días correctamente formateados
      const days = JSON.parse(availability);
      return days.map((day) => ({
        day: day.day,
        startTime: day.startTime,
        endTime: day.endTime,
      }));
    } catch (e) {
      console.error("Error al parsear la disponibilidad:", e);
      return [];
    }
  }
  return [];
};

onMounted(async () => {
  loading.value = true;
  users.value = await getUsers();
  comments.value = await getEmploymentExchangeComments();
  socketBack.on("updateComments", async () => {
    console.log("New comment received");
    comments.value = await getEmploymentExchangeComments();
    users.value = await getUsers();
  });
  if (props.requests.length > 0) {
    loading.value = false;
  }
});
</script>