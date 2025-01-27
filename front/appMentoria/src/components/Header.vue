<template>
  <header>
    <nav
      class="bg-blue-700 border-blue-700 px-4 lg:px-6 py-2.5 dark:bg-blue-800"
    >
      <div
        class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl"
      >
        <div class="flex-1 flex justify-center">
          <div class="flex items-center space-x-5 lg:space-x-40">
            <template v-if="isAdminPage">
              <div class="flex space-x-10 lg:space-x-40">
                <a
                  @click="$router.push('/report')"
                  class="text-white hover:text-gray-200 font-medium text-sm lg:text-base"
                >
                  {{ $t("header.report") }}
                </a>
                <a
                  @click="$router.push('/validation')"
                  class="text-white hover:text-gray-200 font-medium text-sm lg:text-base"
                >
                  {{ $t("header.validation") }}
        
                </a>
                <a
                  @click="$router.push('/services')"
                  class="text-white hover:text-gray-200 font-medium text-sm lg:text-base"
                >
                  {{ $t("header.services") }}
                </a>
              </div>
            </template>
            <template v-else>
              <a
                @click="$router.push('/')"
                class="text-white hover:text-gray-200 font-medium text-sm lg:text-base"
              >
                {{ $t("header.comunity") }}
              </a>
              <a
                @click="$router.push('/profiles')"
                class="text-white hover:text-gray-200 font-medium text-sm lg:text-base"
              >
                {{ $t("header.mentors") }}
              </a>
              <a
                @click="$router.push('/requests')"
                class="text-white hover:text-gray-200 font-medium text-sm lg:text-base"
              >
                {{ $t("header.requests") }}
              </a>
            </template>
            <SubMenu></SubMenu>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import SubMenu from "./SubMenu.vue";

const route = useRoute();

const isAdminPage = computed(() => {
  return (
    route.path.startsWith("/report") ||
    route.path.startsWith("/validation") ||
    route.path.startsWith("/services")
  );
});
</script>