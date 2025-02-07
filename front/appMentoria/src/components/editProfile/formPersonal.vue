<template>
    <div class="dark:bg-gray-800 bg-white p-6 rounded-xl shadow-lg shadow-black/30 my-4">
        <h2 class="text-2xl font-semibold border-b border-gray-600 pb-4 mb-4">{{ $t("formPersonal.title") }}</h2>
        <div class="border-b border-gray-600 pb-4 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="description" class="block font-medium">{{ $t("formPersonal.description") }}</label>
                    <textarea v-model="personalInfo.description" id="description"
                        class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label for="contactPhone" class="block font-medium">{{ $t("formPersonal.phone") }}</label>
                    <input v-model="personalInfo.contactPhone" type="tel" id="contactPhone"
                        class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label for="academicTitle" class="block font-medium">{{ $t("formPersonal.academicTitle") }}</label>
                    <input v-model="personalInfo.academicTitle" type="text" id="academicTitle"
                        class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <h3>{{ $t("formPersonal.SocialMedia") }}</h3>
                    <div>
                        <label for="Instagram"><img alt="Instagram logo"></label>
                        <input v-model="personalInfo.Instagram" placeholder="https://www.instagram.com/ruuubeen_/" id="Instagram" type="text"
                            class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <label for="Twitter"><img alt="Twitter logo"></label>
                        <input v-model="personalInfo.Twitter" placeholder="https://x.com/SpartanConnor16" type="text" id="Twitter"
                            class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <label for="Linkedin"><img src="" alt="Likedin logo"></label>
                        <input v-model="personalInfo.Linkedin" placeholder="https://www.linkedin.com/in/eric-g%C3%B3mez-vil%C3%A0-19b723299/" type="text" id="Linkedin"
                            class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <label for="Facebook"><img src="" alt="Facebook logo"></label>
                        <input v-model="personalInfo.Facebook" placeholder="https://www.facebook.com/climent.fernandez/?locale=af_ZA" type="text" id="Facebook"
                            class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <label for="Github"><img src="" alt="Github logo"></label>
                        <input v-model="personalInfo.Github" placeholder="https://github.com/julsluks" type="text" id="Github"
                            class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                <div>
                    <label for="languages">{{ $t("formPersonal.languages") }}</label>
                    <input v-model="languageTemp" @click.stop @keyup.enter="addChipLanguage()" :placeholder="$t('formPersonal.english')" type="text" id="languages"
                        class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" >
                    <div v-for="chip in chips" class="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full m-2" >
                        <span>{{chip}}</span>
                        <button class="ml-2 text-gray-500 hover:text-gray-700" @click="deleteChipLanguage(chip)">
                            &times;</button>
                    </div>
                </div>
                <div>
                    <label for="softwareSkills">{{ $t("formPersonal.softwareSkills") }}</label>
                    <input v-model="skill"@click.stop @keyup.enter="addChipSkill()" :placeholder="'Java'" type="text" id="softwareSkills"
                        class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    <!-- <button @click="addChipSkill()">test</button> -->
                    <div v-for="chip in chipSkills" class="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full m-2">
                        <span>{{chip}}</span>
                        <button class="ml-2 text-gray-500 hover:text-gray-700" @click="deleteChipSkill(chip)">
                            &times;</button>
                    </div>
                </div>
            </div>
        </div>
        <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" @click="sendEditData()">
            {{ $t("formPersonal.save") }}
        </button>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/index";
import {editData} from "@/services/communicationManager.js";
import { useRouter } from 'vue-router';


const appStore = useAppStore();
const router = useRouter();

var user = ref({});
var profile = ref(null);
var personalInfo = ref({});
var chips = ref([]);
var chipSkills = ref([]);
var languageTemp = ref("");
var skill = ref("");

async function sendEditData(){
    console.log("sendEditData");
    try {
        let dataToSend={};
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
        let res = await editData(dataToSend)
        if(res.status==200){
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
        console.log(user.value.softwareSkills)
        if(user.value.softwareSkills!=null){
            chipSkills.value = user.value.softwareSkills.split(", ") || [];
        } else{
            chipSkills.value = [];
        }
        if(user.value.languages!=null){
        chips.value = user.value.languages.split(", ") || [];
        } else{
            chips.value = [];
        }

        console.log("user.value", user.value);
        
    } catch (error) {
        console.error("Error during onMounted:", error);
    }
});
</script>