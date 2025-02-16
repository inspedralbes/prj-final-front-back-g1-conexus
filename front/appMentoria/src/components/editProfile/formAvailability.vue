<template>
  <div class="bg-bgTheme p-6 rounded-xl shadow-lg shadow-black/30 my-4">
    <h2
      class="text-2xl text-textThemeColor font-semibold border-b border-bgColorPrimary pb-4 mb-4"
    >
      {{ $t("formAvailability.title") }}
    </h2>
    <form class="border-b border-bgColorPrimary pb-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="day in availabilities"
          :key="day.day"
          class="flex flex-col items-start p-4 bg-containersTheme rounded-lg shadow-md"
        >
          <h3 class="text-lg text-font-medium text-textThemeColor mb-2">
            {{ day.day }}
          </h3>
          <label class="flex items-center mb-2">
            <input type="checkbox" v-model="day.enabled" class="mr-2" />
            <span class="text-textThemeColor">{{
              $t("formAvailability.enable")
            }}</span>
          </label>
          <div v-if="day.enabled" class="flex flex-col space-y-2">
            <label class="flex flex-col">
              <span class="text-sm text-textThemeColor">{{
                $t("formAvailability.startTime")
              }}</span>
              <select
                v-model="day.startTime"
                class="mt-1 p-2 border border-bgColorPrimary bg-bgTheme rounded-lg"
              >
                <option
                  v-for="hour in filteredStartTimes(day.endTime)"
                  :value="hour"
                  class="text-textThemeColor"
                >
                  {{ hour }}
                </option>
              </select>
            </label>
            <label class="flex flex-col">
              <span class="text-sm">{{ $t("formAvailability.endTime") }}</span>
              <select
                v-model="day.endTime"
                class="mt-1 p-2 border border-bgColorPrimary bg-bgTheme rounded-lg"
              >
                <option
                  v-for="hour in filteredEndTimes(day.startTime)"
                  :value="hour"
                >
                  {{ hour }}
                </option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </form>
    <button
      @click="saveChanges()"
      class="bg-buttonColorPrimary text-textThemeColor py-2 px-4 rounded-lg hover:bg-buttonColorSecondary"
    >
      {{ $t("formAvailability.save") }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useAppStore } from "@/stores/index";
import { updateAvailability } from "@/services/communicationsScripts/mainManager.js";
import { useI18n } from "vue-i18n";
import router from "@/router";

const { t, locale } = useI18n();
watch(locale, () => {
  retranslate();
});

function retranslate() {
  availabilities.value.forEach((availability, index) => {
    if (index == 0) {
      availability.day = t("formAvailability.monday");
    }
    if (index == 1) {
      availability.day = t("formAvailability.tuesday");
    }
    if (index == 2) {
      availability.day = t("formAvailability.wednesday");
    }
    if (index == 3) {
      availability.day = t("formAvailability.thursday");
    }
    if (index == 4) {
      availability.day = t("formAvailability.friday");
    }
    if (index == 5) {
      availability.day = t("formAvailability.saturday");
    }
    if (index == 6) {
      availability.day = t("formAvailability.sunday");
    }
  });
}

const appStore = useAppStore();
const hours = ref([
  "00:00",
  "00:15",
  "00:30",
  "00:45",
  "01:00",
  "01:15",
  "01:30",
  "01:45",
  "02:00",
  "02:15",
  "02:30",
  "02:45",
  "03:00",
  "03:15",
  "03:30",
  "03:45",
  "04:00",
  "04:15",
  "04:30",
  "04:45",
  "05:00",
  "05:15",
  "05:30",
  "05:45",
  "06:00",
  "06:15",
  "06:30",
  "06:45",
  "07:00",
  "07:15",
  "07:30",
  "07:45",
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
  "21:15",
  "21:30",
  "21:45",
  "22:00",
  "22:15",
  "22:30",
  "22:45",
  "23:00",
  "23:15",
  "23:30",
  "23:45",
]);

const week = ref([
  t("formAvailability.monday"),
  t("formAvailability.tuesday"),
  t("formAvailability.wednesday"),
  t("formAvailability.thursday"),
  t("formAvailability.friday"),
  t("formAvailability.saturday"),
  t("formAvailability.sunday"),
]);

const user = ref({});
const availabilities = ref([]);

async function saveChanges() {
  let auxAvailability = [];
  availabilities.value.forEach((availability, index) => {
    if (availability.enabled) {
      let auxday = translateDay(availability.day);
      auxAvailability.push({
        day: auxday,
        startTime: availability.startTime,
        endTime: availability.endTime,
      });
    }
  });
  let res = await updateAvailability(user.value.id, auxAvailability);
  console.log(res[0]);
  res = res[0];
  if (res.id != undefined && res.id == user.value.id) {
    console.log("User updated");
    console.log(res);
    appStore.setUser(res);
    router.push({ name: "myprofile" });
  } else {
    console.log("Error updating availability");
  }
}

function translateDay(day) {
  switch (day) {
    case t("formAvailability.monday"):
      return "monday";
    case t("formAvailability.tuesday"):
      return "tuesday";
    case t("formAvailability.wednesday"):
      return "wednesday";
    case t("formAvailability.thursday"):
      return "thursday";
    case t("formAvailability.friday"):
      return "friday";
    case t("formAvailability.saturday"):
      return "saturday";
    case t("formAvailability.sunday"):
      return "sunday";
  }
}

function filteredStartTimes(endTime) {
  return hours.value.filter((hour) => hour < endTime);
}

function filteredEndTimes(startTime) {
  return hours.value.filter((hour) => hour > startTime);
}
function formatDay(day) {
  switch (day) {
    case "Dilluns":
      return t("formAvailability.monday");
    case "Dimarts":
      return t("formAvailability.tuesday");
    case "Dimecres":
      return t("formAvailability.wednesday");
    case "Dijous":
      return t("formAvailability.thursday");
    case "Divendres":
      return t("formAvailability.friday");
    case "Dissabte":
      return t("formAvailability.saturday");
    case "Diumenge":
      return t("formAvailability.sunday");
  }
}
onMounted(() => {
  user.value = appStore.getUser();

  console.log(user.value.availability);
  if (
    user.value.availability === undefined ||
    user.value.availability === null
  ) {
    user.value.availability = [];
  }
  if (user.value.availability.length === 0) {
    week.value.forEach((day, index) => {
      availabilities.value.push({
        day: day,
        enabled: false,
        startTime: "00:00",
        endTime: "23:00",
      });
    });
  } else {
    // user.value.availability.forEach((availability, index) => {
    //     availabilities.value.push({
    //         day: formatDay(availability.day),
    //         enabled: true,
    //         startTime: availability.startTime,
    //         endTime: availability.endTime,
    //     });
    // });
    week.value.forEach((day) => {
      const availability = user.value.availability.find(
        (availability) => formatDay(availability.day) === day
      );
      if (availability) {
        availabilities.value.push({
          day: formatDay(availability.day),
          enabled: true,
          startTime: availability.startTime,
          endTime: availability.endTime,
        });
      } else {
        availabilities.value.push({
          day: day,
          enabled: false,
          startTime: "00:00",
          endTime: "23:00",
        });
      }
    });
  }
});
</script>
