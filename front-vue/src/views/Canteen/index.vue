<template>
  <div id="technician-app" class="flex flex-col min-h-screen text-white">
    <!-- Botó Hamburguesa per a Mòbil -->
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/80 rounded-lg shadow-lg hidden"
    >
      <svg
        class="h-6 w-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    </button>

    <!-- Barra Lateral (Visible només a mòbil) -->
    <aside
      :class="[
        'w-64 bg-slate-900/80 backdrop-blur-sm fixed h-screen p-4 shadow-lg transform transition-transform duration-300 z-40 lg:hidden',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="text-center mb-8">
        <router-link
          to="/canteen/panel"
          class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Cantina
        </router-link>
      </div>
      <nav class="space-y-2">
        <router-link
          to="/canteen/chat"
          class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span>Xat</span>
        </router-link>
        <router-link
          to="/canteen/menu-admin"
          class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Administrar menú</span>
        </router-link>
      </nav>
      <!-- Botó de Tancar Sessió -->
      <div class="mt-4 pt-4 border-t border-gray-700">
        <button
          @click="logout"
          class="w-full flex items-center justify-center p-2 text-gray-300 hover:text-red-400 rounded-lg transition-colors duration-300"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Tancar Sessió
        </button>
      </div>
    </aside>

    <!-- Contingut Principal -->
    <header
      class="w-full bg-slate-900/80 backdrop-blur-sm shadow-lg fixed top-0 z-40"
    >
      <div class="container mx-auto flex items-center justify-between p-4">
        <router-link
          to="/canteen/panel"
          class="text-white text-2xl font-bold hover:text-gray-300 transition-colors duration-300"
        >
          Cantina
        </router-link>
        <nav class="flex space-x-4">
          <router-link
            to="/canteen/chat"
            class="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>Xat</span>
          </router-link>
          <router-link
            to="/canteen/menu-admin"
            class="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Administrar menú</span>
          </router-link>

          <button
            @click="logout"
            class="flex items-center text-gray-300 hover:text-red-400 transition-colors duration-300"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Tancar Sessió</span>
          </button>
        </nav>
      </div>
    </header>

    <nav
      class="lg:hidden bg-slate-800/80 backdrop-blur-sm py-4 fixed w-full z-30 shadow-lg"
    >
      <div class="container mx-auto flex justify-between items-center px-4">
        <!-- Menú Hamburguesa i Títol -->
        <div class="flex items-center ml-12 p-2">
          <router-link
            to="/canteen/panel"
            class="text-xl font-bold text-gray-300"
          >
            {{ currentPageTitle }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Contingut Principal -->
    <main class="flex-1 w-full flex items-center justify-center pt-16">
      <div class="container mx-auto max-w-4xl">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/index.js";

const store = useAppStore();
const router = useRouter();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = () => {
  store.setAccessToken("");
  store.setUser({});
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  router.push("/");
};
</script>
