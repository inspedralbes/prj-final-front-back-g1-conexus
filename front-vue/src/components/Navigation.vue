<template>
  <nav class="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-white font-bold text-xl"
            >Conexus</router-link
          >
        </div>

        <div class="flex items-center space-x-4">
          <!-- Enlaces según el rol del usuario -->
          <template v-if="userRole === 'Administrador'">
            <router-link
              to="/admin"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Administració</router-link
            >
          </template>

          <template v-else-if="userRole === 'Professor'">
            <router-link
              to="/teachers"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Àrea de professor</router-link
            >
          </template>

          <template v-else-if="userRole === 'Estudiant'">
            <router-link
              to="/students"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Àrea d'estudiant</router-link
            >
          </template>

          <template v-else-if="userRole === 'Tècnic'">
            <router-link
              to="/technicians"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Àrea de tècnic</router-link
            >
          </template>

          <!-- Chat Link with Badge -->
          <router-link
            to="/chats"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium relative"
          >
            Xats
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full"
            >
              {{ unreadCount }}
            </span>
          </router-link>

          <!-- Perfil y cerrar sesión -->
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center text-sm rounded-full focus:outline-none"
            >
              <img
                v-if="userProfile"
                class="h-8 w-8 rounded-full object-cover border border-slate-600"
                :src="userProfile"
                alt="User profile"
              />
              <div
                v-else
                class="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white"
              >
                {{ userInitials }}
              </div>
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10"
            >
              <div class="py-1">
                <div
                  class="block px-4 py-2 text-sm text-gray-400 border-b border-slate-700"
                >
                  {{ userName }}
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700"
                  >Perfil</router-link
                >
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700"
                >
                  Tancar sessió
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useAppStore } from "@/stores/index.js";
import { useRouter } from "vue-router";

const store = useAppStore();
const router = useRouter();

const showDropdown = ref(false);

// User info
const user = computed(() => store.getUser());
const userProfile = computed(() => user.value?.profile || "");
const userName = computed(() => user.value?.name || "Usuario");
const userRole = computed(() => user.value?.typeusers?.name || "");

// Get unread count from the store
const unreadCount = computed(() => store.getUnreadCount);

const userInitials = computed(() => {
  if (!userName.value) return "?";
  return userName.value
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const logout = () => {
  showDropdown.value = false;
  store.setAccessToken("");
  store.setUser({});
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  router.push("/");
};

// Interval reference to clear on unmount
const interval = ref(null);

// Check for unread messages periodically
onMounted(() => {
  // Initial check
  store.updateUnreadMessagesCount();
  console.log("Initial unread count:", store.getUnreadCount);

  // Set up interval to check regularly
  interval.value = setInterval(() => {
    store.updateUnreadMessagesCount();
    console.log("Updated unread count (interval):", store.getUnreadCount);
  }, 2000);
});

// Clean up on unmount
onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
});

// Also watch for route changes to update message count
watch(
  () => router.currentRoute.value.path,
  () => {
    // Update the message count when route changes
    store.updateUnreadMessagesCount();
  }
);
</script>