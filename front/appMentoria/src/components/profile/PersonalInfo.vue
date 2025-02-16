<template>
    <div class="bg-containersTheme p-6 rounded-xl shadow-lg shadow-custom my-4">
        <h2 class="text-xl font-semibold border-b border-buttonColorPrimary pb-4 mb-4 text-textThemeColor">Informació Personal</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-20 border-b border-buttonColorPrimary pb-4">
            <div class="space-y-4">
                <!-- Full Name -->
                <div class="space-y-1">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.titlePage") }}</h3>
                    <p class="text-textThemeColor">{{ user.value.name }}</p>
                </div>

                <!-- Biography -->
                <div class="space-y-1">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.desc") }}</h3>
                    <p class="text-textThemeColor">
                        {{ user.value.description || $t("PersonalInfo.noDesc") }}
                    </p>
                </div>

                <!-- Social Links -->
                <div class="space-y-1">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.socialMedia") }}</h3>
                    <div class="flex space-x-4 mt-4">
                        <!-- Github Icon with Tooltip -->
                        <div v-if="user.value.Github" class="relative group">
                            <!-- Icon -->
                            <button
                            class="text-textThemeColor p-2 rounded-lg hover:text-buttonColorSecondary hover:bg-textThemeColor">
                                <a :href="user.value.github_link" target="_blank" rel="noopener noreferrer">
                                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd"
                                            d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </a>
                                <span class="hidden text-textThemeColor">Github</span>
                            </button>
                            <!-- Tooltip -->
                            <div
                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-bgTheme border border-buttonColorPrimary text-textThemeColor text-sm rounded-lg py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                {{ $t("PersonalInfo.githubProfile") }}
                            </div>
                            <!-- Tooltip Arrow -->
                            <div
                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-3 h-3 bg-bgTheme border border-buttonColorPrimary text-textThemeColor opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45">
                            </div>
                        </div>
                        <!-- LinkedIn Icon with Tooltip -->
                        <div v-if="user.value.Linkedin" class="relative group">
                            <!-- Icon -->
                            <button
                            class="text-textThemeColor p-2 rounded-lg hover:text-buttonColorSecondary hover:bg-textThemeColor">
                                <a :href="user.value.linkedin_link" target="_blank" rel="noopener noreferrer">
                                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd"
                                            d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                                            clip-rule="evenodd" />
                                        <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                    </svg>
                                </a>
                                <span class="hidden text-textThemeColor">LinkedIn</span>
                            </button>
                            <!-- Tooltip -->
                            <div
                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-bgTheme border border-buttonColorPrimary text-textThemeColor text-sm rounded-lg py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                {{ $t("PersonalInfo.LinkedinProfile") }}
                            </div>
                            <!-- Tooltip Arrow -->
                            <div
                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-3 h-3 bg-bgTheme border border-buttonColorPrimary text-textThemeColor opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45">
                            </div>
                        </div>
                        <!-- Twitter Icon with Tooltip -->
                        <div v-if="user.value.Twitter" class="relative group">
                            <!-- Icon -->
                            <button
                                class="text-textThemeColor p-2 rounded-lg hover:text-buttonColorSecondary hover:bg-textThemeColor">
                                <a :href="user.value.twitter_link" target="_blank" rel="noopener noreferrer">
                                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                    </svg>
                                </a>
                                <span class="hidden">Twitter</span>
                            </button>
                            <!-- Tooltip -->
                            <div
                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-bgTheme border border-buttonColorPrimary text-textThemeColor text-sm rounded-lg py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                {{ $t("PersonalInfo.TwitterProfile") }}
                            </div>
                            <!-- Tooltip Arrow -->
                            <div
                                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-3 h-3 bg-bgTheme border border-buttonColorPrimary text-textThemeColor opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45">
                            </div>
                        </div>
                        <!-- Instagram Icon with Tooltip -->
                        <div v-if="user.value.Instagram" class="relative group">
                            <!-- Icon -->
                            <button
                                class="text-textThemeColor p-2 rounded-lg hover:text-buttonColorSecondary hover:bg-textThemeColor">
                                <a :href="user.value.instagram_link" target="_blank" rel="noopener noreferrer">
                                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path fill="currentColor" fill-rule="evenodd"
                                            d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </a>
                                <span class="hidden">Instagram</span>
                            </button>
                            <!-- Tooltip -->
                            <div
                                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-bgTheme border border-buttonColorPrimary text-textThemeColor text-sm rounded-lg py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                {{ $t("PersonalInfo.InstagramProfile") }}
                            </div>
                            <!-- Tooltip Arrow -->
                            <div
                                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-3 h-3 bg-bgTheme border border-buttonColorPrimary text-textThemeColor opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45">
                            </div>
                        </div>
                        <!-- Facebook Icon with Tooltip -->
                        <div v-if="user.value.Facebook" class="relative group">
                            <!-- Icon -->
                            <button
                                class="text-textThemeColor p-2 rounded-lg hover:text-buttonColorSecondary hover:bg-textThemeColor">
                                <a :href="user.value.facebook_link" target="_blank" rel="noopener noreferrer">
                                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd"
                                            d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </a>
                                <span class="hidden">Facebook</span>
                            </button>
                            <!-- Tooltip -->
                            <div
                                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-bgTheme border border-buttonColorPrimary text-textThemeColor text-sm rounded-lg py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                {{ $t("PersonalInfo.FacebookProfile") }}
                            </div>
                            <!-- Tooltip Arrow -->
                            <div
                                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-3 h-3 bg-bgTheme border border-buttonColorPrimary  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Location -->
                <div class="space-y-1">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.location") }}</h3>
                    <div class="flex items-center space-x-1 text-textThemeColor">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
                                clip-rule="evenodd" />
                        </svg>
                        <p>{{ user.value.city }}</p>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <!-- Job Title -->
                <div class="space-y-1">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.title") }}</h3>
                    <div class="flex items-center space-x-2 text-textThemeColor">
                        <svg class="w-5 h-5 text-textThemeColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l1.447.723.005.003.027.013.12.056c.108.05.272.123.486.212.429.177 1.056.416 1.834.655C7.481 13.524 9.63 14 12 14c2.372 0 4.52-.475 6.08-.956.78-.24 1.406-.478 1.835-.655a14.028 14.028 0 0 0 .606-.268l.027-.013.005-.002L22 11.381V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.447 7.894.553-.276V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.382l.553.276.002.002.004.002.013.006.041.02.151.07c.13.06.318.144.557.242.478.198 1.163.46 2.01.72C7.019 15.476 9.37 16 12 16c2.628 0 4.98-.525 6.67-1.044a22.95 22.95 0 0 0 2.01-.72 15.994 15.994 0 0 0 .707-.312l.041-.02.013-.006.004-.002.001-.001-.431-.866.432.865ZM12 10a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-textThemeColor">{{ user.value.title || $t("PersonalInfo.studying") }}</p>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="space-y-1">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.contact") }}</h3>
                    <p class="text-textThemeColor">{{ $t("PersonalInfo.email") }} {{ user.value.email }}
                    </p>
                    <p class="text-textThemeColor ">{{ $t("PersonalInfo.phone") }} {{ user.value.phone ||
                        'No hi ha...' }}
                    </p>
                </div>

                <!-- Software Skills -->
                <div class="space-y-1" v-if="user.value.softwareSkills">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.softwareSkills") }}</h3>
                    <div class="flex flex-wrap space-x-4 w-full overflow-hidden">
                        <span v-if="user.value.softwareSkills && user.value.softwareSkills.length > 0"
                            v-for="tag in user.value.softwareSkills.split(', ')" :key="tag"
                            class="p-2 rounded-lg text-textThemeColor bg-bgTheme border-2 border-buttonColorPrimary">{{ tag
                            }}</span>
                        <span v-else class="text-textThemeColor">{{
                            $t("PersonalInfo.developingSoftwareSkills") }}</span>
                    </div>
                </div>

                <!-- Languages -->
                <div class="space-y-1" v-if="user.value.languages">
                    <h3 class="font-semibold text-textThemeColor">{{ $t("PersonalInfo.languages") }}</h3>
                    <p class="text-textThemeColor" v-if="!user.value.languages">{{
                        $t("PersonalInfo.noLanguages") }}</p>
                    <div class="flex flex-wrap space-x-4 w-full overflow-hidden">
                        <span v-if="user.value.languages" v-for="lang in user.value.languages.split(', ')" :key="lang"
                        class="p-2 rounded-lg text-textThemeColor bg-bgTheme border-2 border-buttonColorPrimary">{{
                            lang }}</span>
                    </div>
                </div>
            </div>
        </div>
        <button @click="$router.push('/editProfile/profile')" v-if="user.value.id === userId"
            class="flex items-center space-x-1 mt-6 bg-buttonColorPrimary hover:bg-buttonColorSecondary text-textThemeColor py-2 px-4 rounded-lg shadow">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                    d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
                    clip-rule="evenodd" />
            </svg>
            <span>{{ $t("PersonalInfo.edit") }}</span>
        </button>
    </div>
</template>

<script setup>
import { computed,ref  } from 'vue';
import { useAppStore } from "@/stores/index";
let appStore = useAppStore();
const userId=ref(appStore.getUser().id)
const props = defineProps({
    user: Object
});

const user = computed(() => props.user);
</script>