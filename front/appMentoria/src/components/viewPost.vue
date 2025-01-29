<template>
  <div>
    <div
      v-if="loading"
      class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800"
    >
      <Loading />
    </div>
    <div v-else>
      <div
        v-if="selectedPost"
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
            selectedPost.reports === 0 ||
            selectedPost.text_ia === 0 ||
            selectedPost.image_ia === 0
          "
        >
          <header class="flex items-center p-4 border-b">
            <img
              :src="getAuthorProfile(selectedPost.user_id)"
              alt="Avatar"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 class="font-bold text-lg">
                {{ getAuthorName(selectedPost.user_id) }}
              </h2>
              <p class="text-gray-500 text-sm dark:text-white mb-6">
                {{ getAuthorHandle(selectedPost.user_id) }} ·
                {{ timeSince(selectedPost.created_at) }}
              </p>
            </div>
          </header>

          <main class="p-4 space-y-4">
            <h1 class="text-xl font-bold">{{ selectedPost.title }}</h1>
            <p
              class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300"
            >
              {{ selectedPost.description }}
            </p>

            <div
              v-if="selectedPost.image != null"
              class="rounded-lg overflow-hidden"
            >
              <img
                :src="`${community_url}${selectedPost.image}`"
                alt="Post Image"
                class="w-full"
              />
            </div>
          </main>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-bold">{{ $t("viewPost.comentaris") }}</h3>
          <div class="border-t-2 border-gray-200 px-4 p-4 mb-2 sm:mb-0">
            <div class="relative flex">
              <input
                ref="commentInput"
                type="text"
                placeholder="Escriu un comentari!"
                class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-20 bg-gray-200 rounded-md py-3 dark:bg-gray-800 dark:text-white"
              />
              <div class="absolute right-0 items-center inset-y-0 flex">
                <button v-if="!loadingComment[null]"
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
                <button v-if="loadingComment[null]"
                  class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4"
                >
                <svg
                  class="animate-spin h-4 w-4 text-gray-800 dark:text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  ></circle>
                  <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                </button>
              </div>
            </div>
          </div>
          <ul>
            <li
              v-for="comment in getCommentsWithPostId(selectedPost.id).filter(
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
                    placeholder="Escriu un comentari!"
                    v-model="replyInputs[comment.id]"
                    class="w-3/4 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-3 pr-16 bg-gray-200 rounded-md py-2 dark:bg-gray-800 dark:text-white"
                    style="width: 100%"
                  />
                  <div class="absolute right-0 items-center inset-y-0 flex">
                    <button v-if="!loadingComment[comment.id]"
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
                    <button v-if="loadingComment[comment.id]"
                      class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4"
                    >
                    <svg
                      class="animate-spin h-4 w-4 text-gray-800 dark:text-gray-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      ></circle>
                      <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-else>
        <div
          v-for="post in posts.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )"
          :key="post.id"
          class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 dark:bg-gray-900"
        >
          <div v-if="post.reports === 0">
            <header class="flex items-center p-4 border-b">
              <img
                :src="getAuthorProfile(post.user_id)"
                alt="Avatar"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 class="font-bold text-lg">
                  {{ getAuthorName(post.user_id) }}
                </h2>
                <p class="text-gray-500 text-sm dark:text-white">
                  {{ getAuthorHandle(post.user_id) }} ·
                  {{ timeSince(post.created_at) }}
                </p>
              </div>
            </header>

            <main class="p-4 space-y-4">
              <h1 class="text-xl font-bold">{{ post.title }}</h1>
              <p
                class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300"
              >
                {{ post.description }}
              </p>

              <div v-if="post.image != null" class="rounded-lg overflow-hidden">
                <img
                  :src="`${community_url}${post.image}`"
                  alt="Post Image"
                  class="w-full"
                />
              </div>
            </main>

            <footer class="p-4 border-t">
              <div class="flex justify-around text-gray-500 dark:text-gray-300">
                <button
                  class="flex items-center space-x-1 hover:text-gray-500"
                  @click="showPostWithComments(post)"
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
                  <span>{{ getCommentsWithPostId(post.id).length }}</span>
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, defineProps } from "vue";
import {
  getUsers,
  getCommunityComments,
  postCommunityComments,
} from "../services/communicationManager";
import socketBack from "../services/socketBack.js";
import { useAppStore } from "@/stores/index";
import Loading from "@/components/Loading.vue"; // Import the Loading component

const community_url = import.meta.env.VITE_URL_BACK_COMMUNITY;
const back_url = import.meta.env.VITE_URL_BACK;
const loadingComment = ref({});
const users = ref([]);
const comments = ref([]);
const selectedPost = ref(null);
const loading = ref(true); // Add loading state
const commentLoading = ref(false); // Add comment loading state
const publicationLoading = ref(false); // Add publication loading state

const commentInput = ref(null);
const replyInputs = ref({});

var myUser = useAppStore().getUser();

const props = defineProps({
  posts: Array,
  message: String,
});

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

const getCommentsWithPostId = (postId) => {
  const list = comments.value.filter(
    (comment) => comment.publication_id === postId && comment.reported === 0
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
      publication_id: selectedPost.value.id,
      commentReply_id: null,
      created_at: new Date().toISOString(),
    };
    loadingComment.value[null] = true;
    await postCommunityComments(comment);
    socketBack.emit("newComment", comment);
    commentInput.value.value = "";
    loadingComment.value[null] = false;
  } else {
    if (!replyInputs.value[ID]) return;
    const message = replyInputs.value[ID];
    const replyComment = {
      comment: message,
      user_id: myUser.id,
      publication_id: selectedPost.value.id,
      commentReply_id: ID,
      created_at: new Date().toISOString(),
    };
    loadingComment.value[ID] = true;
    await postCommunityComments(replyComment);
    socketBack.emit("newComment", replyComment);
    loadingComment.value[ID] = false;
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

const showPostWithComments = (post) => {
  selectedPost.value = post;
};

function goMain() {
  selectedPost.value = null;
}

onMounted(async () => {
  loading.value = true;
  users.value = await getUsers();
  comments.value = await getCommunityComments();
  socketBack.on("updateComments", async () => {
    console.log("New comment received");
    comments.value = await getCommunityComments();
    users.value = await getUsers();
  });
  if (props.posts.length > 0) {
    loading.value = false;
  }
});
</script>