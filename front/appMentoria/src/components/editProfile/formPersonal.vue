<template>
  <div class="bg-containersTheme p-6 rounded-xl shadow-lg shadow-black/30 my-4">
    <h2
      class="text-2xl font-semibold border-b border-buttonColorPrimary pb-4 mb-4"
    >
      {{ $t("formPersonal.title") }}
    </h2>
    <div class="border-b border-buttonColorPrimary pb-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="description" class="block font-medium">{{
            $t("formPersonal.description")
          }}</label>
          <textarea
            v-model="personalInfo.description"
            id="description"
            class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
          />
        </div>
        <div>
          <label for="contactPhone" class="block font-medium">{{
            $t("formPersonal.phone")
          }}</label>
          <input
            v-model="personalInfo.contactPhone"
            type="tel"
            id="contactPhone"
            class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
          />
        </div>
        <div>
          <label for="academicTitle" class="block font-medium">{{
            $t("formPersonal.academicTitle")
          }}</label>
          <input
            v-model="personalInfo.academicTitle"
            type="text"
            id="academicTitle"
            class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
          />
        </div>
        <div>
          <h3>{{ $t("formPersonal.SocialMedia") }}</h3>
          <div>
            <div class="py-2 flex items-center space-x-2 text-textThemeColor">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 448 512"
                class="w-6 h-6 text-textThemeColor"
                alt="Instagram logo"
              >
                <path
                  d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                />
              </svg>
              <span>Instagram logo</span>
            </div>
            <input
              v-model="personalInfo.Instagram"
              placeholder="https://www.instagram.com/ruuubeen_/"
              id="Instagram"
              type="text"
              class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
            />
            <div
              for="Twitter"
              class="py-2 flex items-center space-x-2 text-textThemeColor"
            >
              <span class="[&>svg]:h-6 [&>svg]:w-6 text-textThemeColor">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                  <path
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                  />
                </svg>
              </span>
              <span>Twitter logo</span>
            </div>
            <input
              v-model="personalInfo.Twitter"
              placeholder="https://x.com/SpartanConnor16"
              type="text"
              id="Twitter"
              class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
            />
            <div for="Linkedin" class="py-2 flex items-center space-x-2">
              <span class="[&>svg]:h-6 [&>svg]:w-6 text-textThemeColor">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"
                  />
                </svg>
              </span>
              <span>LinkedIn logo</span>
            </div>
            <input
              v-model="personalInfo.Linkedin"
              placeholder="https://www.linkedin.com/in/eric-g%C3%B3mez-vil%C3%A0-19b723299/"
              type="text"
              id="Linkedin"
              class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
            />
            <div for="Facebook" class="py-2 flex items-center space-x-2">
              <span class="[&>svg]:h-6 [&>svg]:w-6 text-textThemeColor">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                  <path
                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                  />
                </svg>
              </span>
              <span>Facebook logo</span>
            </div>
            <input
              v-model="personalInfo.Facebook"
              placeholder="https://www.facebook.com/climent.fernandez/?locale=af_ZA"
              type="text"
              id="Facebook"
              class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
            />
            <div for="Github" class="py-2 flex items-center space-x-2">
              <span class="[&>svg]:h-6 [&>svg]:w-6 text-textThemeColor">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 496 512"
                >
                  <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                  <path
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                  />
                </svg>
              </span>
              <span>GitHub logo</span>
            </div>
            <input
              v-model="personalInfo.Github"
              placeholder="https://github.com/julsluks"
              type="text"
              id="Github"
              class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
            />
          </div>
        </div>

        <div>
          <label for="languages">{{ $t("formPersonal.languages") }}</label>
          <input
            v-model="languageTemp"
            @click.stop
            @keyup.enter="addChipLanguage()"
            :placeholder="$t('formPersonal.english')"
            type="text"
            id="languages"
            class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
          />
          <div
            v-for="chip in chips"
            class="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full m-2"
          >
            <span>{{ chip }}</span>
            <button
              class="ml-2 text-textThemeColor hover:text-gray-700"
              @click="deleteChipLanguage(chip)"
            >
              &times;
            </button>
          </div>
        </div>
        <div>
          <label for="softwareSkills" class="text-textThemeColor">{{
            $t("formPersonal.softwareSkills")
          }}</label>
          <input
            v-model="skill"
            @click.stop
            @keyup.enter="addChipSkill()"
            :placeholder="'Java'"
            type="text"
            id="softwareSkills"
            class="bg-bgTheme w-full border border-textColorPrimary rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-buttonColorSecondary focus:border-buttonColorTertiary"
          />
          <!-- <button @click="addChipSkill()">test</button> -->
          <div
            v-for="chip in chipSkills"
            class="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full m-2"
          >
            <span>{{ chip }}</span>
            <button
              class="ml-2 text-gray-500 hover:text-gray-700"
              @click="deleteChipSkill(chip)"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      class="bg-buttonColorPrimary text-white py-2 px-4 rounded-lg hover:bg-buttonColorTertiary"
      @click="sendEditData()"
    >
      {{ $t("formPersonal.save") }}
    </button>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/index";
import { editData } from "@/services/communicationsScripts/mainManager.js";
import { useRouter } from "vue-router";

const appStore = useAppStore();
const router = useRouter();

var user = ref({});
var profile = ref(null);
var personalInfo = ref({});
var chips = ref([]);
var chipSkills = ref([]);
var languageTemp = ref("");
var skill = ref("");

async function sendEditData() {
  console.log("sendEditData");
  try {
    let dataToSend = {};
    dataToSend.description = personalInfo.value.description || null;
    dataToSend.phone = personalInfo.value.contactPhone || null;
    dataToSend.tags = chips.value.join(", ") || null;
    dataToSend.skills = chipSkills.value.join(", ") || null;
    dataToSend.Instagram = personalInfo.value.Instagram || null;
    dataToSend.Twitter = personalInfo.value.Twitter || null;
    dataToSend.Linkedin = personalInfo.value.Linkedin || null;
    dataToSend.Facebook = personalInfo.value.Facebook || null;
    dataToSend.Github = personalInfo.value.Github || null;
    dataToSend.title = personalInfo.value.academicTitle || null;
    dataToSend.id = user.value.id;
    let res = await editData(dataToSend);
    if (res.status == 200) {
      console.log("Data sent successfully");
      router.push({ name: "myprofile" });
    }
  } catch (error) {
    console.error("Error sending edit data:", error);
  }
}

function deleteChipLanguage(selectedChip) {
  try {
    let nothingDeleted = true;
    chips.value.forEach((data, index) => {
      if (data === selectedChip) {
        chips.value.splice(index, 1);
        nothingDeleted = false;
      }
    });
  } catch (error) {
    console.error("Error deleting language chip:", error);
  }
}

function addChipLanguage() {
  try {
    if (languageTemp.value.trim() === "") return;
    chips.value.push(languageTemp.value);
    console.log(chips.value);
    languageTemp.value = "";
  } catch (error) {
    console.error("Error adding language chip:", error);
  }
}

function addChipSkill() {
  try {
    if (skill.value.trim() == "") return;
    chipSkills.value.push(skill.value);
    console.log(chipSkills.value);
    skill.value = "";
  } catch (error) {
    console.error("Error adding skill chip:", error);
  }
}

function deleteChipSkill(selectedChip) {
  try {
    let nothingDeleted = true;
    chipSkills.value.forEach((data, index) => {
      if (data === selectedChip && nothingDeleted) {
        chipSkills.value.splice(index, 1);
        nothingDeleted = false;
      }
    });
  } catch (error) {
    console.error("Error deleting skill chip:", error);
  }
}

onMounted(() => {
  try {
    user.value = appStore.getUser();
    profile.value = user.value.profile;
    personalInfo.value = {
      contactEmail: user.value.contactEmail || "",
      contactPhone: user.value.phone || "",
      description: user.value.description || "",
      academicTitle: user.value.title || "",
      Instagram: user.value.Instagram || "",
      Twitter: user.value.Twitter || "",
      Linkedin: user.value.Linkedin || "",
      Facebook: user.value.Facebook || "",
      Github: user.value.Github || "",
    };
    console.log(user.value.softwareSkills);
    if (user.value.softwareSkills != null) {
      chipSkills.value = user.value.softwareSkills.split(", ") || [];
    } else {
      chipSkills.value = [];
    }
    if (user.value.languages != null) {
      chips.value = user.value.languages.split(", ") || [];
    } else {
      chips.value = [];
    }

    console.log("user.value", user.value);
  } catch (error) {
    console.error("Error during onMounted:", error);
  }
});
</script>