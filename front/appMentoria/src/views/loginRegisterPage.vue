<template>
  <div class="min-h-screen bg-bgTheme text-gray-900 flex justify-center">
    <div
      class="max-w-screen-xl m-0 sm:m-10 bg-containersTheme shadow sm:rounded-lg flex justify-center flex-1"
    >
      <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div class="mt-12 flex flex-col items-center">
          <div
            v-if="message"
            :class="{
              'bg-green-100 border-green-500 text-green-700':
                messageType == 'success',
              'bg-red-100 border-red-500 text-red-700': messageType == 'error',
            }"
            class="border-l-4 p-4 mb-3 rounded-lg"
          >
            <p>{{ message }}</p>
          </div>
          <h1 class="text-2xl xl:text-3xl font-extrabold mb-5 text-textThemeColor">CONEXUS</h1>
          <h2 class="text-xl font-light xl:text-2xl mb-3 text-textThemeColor">
            {{ $t("LoginRegisterPage.subTitle") }}
          </h2>
          <div class="w-full flex-1 mt-3">
            <div class="flex flex-col items-center">
              <button
                @click="signInWithGoogle"
                class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-buttonColorPrimary text-textThemeColor hover:bg-buttonColorSecondary flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
              >
                <div class="bg-white p-2 rounded-full">
                  <svg class="w-4" viewBox="0 0 533.5 544.3">
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      fill="#4285f4"
                    />
                    <path
                      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      fill="#34a853"
                    />
                    <path
                      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      fill="#fbbc04"
                    />
                    <path
                      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      fill="#ea4335"
                    />
                  </svg>
                </div>
                <span class="ml-4">{{ $t("LoginRegisterPage.accessGoogle") }}</span>
              </button>

              <button
                @click="signInWithGithub"
                class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-buttonColorPrimary text-textThemeColor hover:bg-buttonColorSecondary flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
              >
                <div class="bg-white p-1 rounded-full">
                  <svg class="w-6" viewBox="0 0 32 32">
                    <path
                      fill-rule="evenodd"
                      d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                    />
                  </svg>
                </div>
                <span class="ml-4">{{ $t("LoginRegisterPage.accessGithub") }}</span>
              </button>
            </div>

            <div class="my-12 border-b text-center">
              <div
                class="leading-none px-2 inline-block text-sm text-textThemeColor tracking-wide font-medium bg-bgTheme transform translate-y-1/2"
              >
                {{ $t("LoginRegisterPage.logIn") }}
              </div>
            </div>

            <div class="mx-auto max-w-xs">
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-bgTheme dark:text-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                :placeholder="$t('LoginRegisterPage.mailPlaceholder')"
                v-model="userLogin.email"
              />
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-bgTheme dark:text-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                type="password"
                :placeholder="$t('LoginRegisterPage.passwordPlaceholder')"
                v-model="userLogin.password"
              />
              <button
                @click="signInWithApp"
                class="mt-5 tracking-wide font-semibold bg-buttonColorPrimary text-textThemeColor w-full py-4 rounded-lg hover:bg-buttonColorSecondary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <svg
                  class="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span class="ml-3"> {{ $t("LoginRegisterPage.loginButton") }}</span>
              </button>
              <p
                class="mt-6 text-xs text-textThemeColor text-center"
              >
                {{ $t("LoginRegisterPage.projectBy") }}
                <span class="border-b border-textThemeColor border-dotted">
                  Conexus
                </span>
                {{ $t("LoginRegisterPage.withTheHelpOf") }}
                <span class="border-b border-textThemeColor border-dotted">
                  Institut Pedralbes
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-1 bg-indigo-100 text-center hidden lg:flex items-center justify-center"
      >
        <div
          class="m-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style="background-image: url('/logo.jpg')"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { loginAPI, loginDB } from "@/services/communicationsScripts/mainManager";
import { useAppStore } from "@/stores/index";
import router from "@/router";

const apikey = import.meta.env.VITE_FIREBASE_API_KEY;
console.log(apikey);

// Firebase configuration
const firebaseConfig = {
  apiKey: apikey,
  authDomain: "tr2-dam-mentories.firebaseapp.com",
  projectId: "tr2-dam-mentories",
  storageBucket: "tr2-dam-mentories.firebaseapp.com",
  messagingSenderId: "338164475859",
  appId: "1:338164475859:web:e69d1ef2426b26d9e0f126",
  measurementId: "G-KTW22GCCFB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// State and methods
const message = ref("");
const messageType = ref("");

const userLogin = reactive({
  email: "",
  password: "",
});

const userAPIs = reactive({
  email: "",
  name: "",
  token: "",
  profile: "",
});

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    userAPIs.token = result.user.uid;
    userAPIs.email = result.user.email;
    userAPIs.name = result.user.displayName;
    userAPIs.profile = result.user.photoURL;

    validateAndLogin(userAPIs);
  } catch (error) {
    message.value = $t("LoginRegisterPage.error");
    messageType.value = "error";
  }
};

const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    userAPIs.token = result.user.uid;
    userAPIs.email = result.user.email;
    userAPIs.name = "GitHub User";
    userAPIs.profile = result.user.photoURL;

    validateAndLogin(userAPIs);
  } catch (error) {
    message.value = $t("LoginRegisterPage.error");
    messageType.value = "error";
  }
};

const signInWithApp = async () => {
  let succes = false;
  let profileURL = ref("");
  let bannerURL = ref("");

  try {
    const response = await loginDB(userLogin);

    if (response.error) {
      return;
    } else {
      succes = true;
    }

    let user = response.userLogin;
    let profile = user.profile;

    bannerURL.value = `${import.meta.env.VITE_URL_BACK}${user.banner}`;
    if (profile.includes("/upload/", 0)) {
      profileURL.value = `${import.meta.env.VITE_URL_BACK}${user.profile}`;
    } else {
      profileURL.value = user.profile;
    }

    user.profile = profileURL.value;
    user.banner = bannerURL.value;

    useAppStore().setAccessToken(response.accessToken);
    useAppStore().setRefreshToken(response.refreshToken);
    useAppStore().setUser(user);

    localStorage.setItem("user", JSON.stringify(user.email));
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
  } catch (error) {
    message.value = $t("LoginRegisterPage.errorFields");
    messageType.value = "error";
  } finally {
    if (succes) {
      router.push({ name: "main" });
    }
  }
};

async function validateAndLogin(user) {
  let succes = false;
  let profileURL = ref("");
  let bannerURL = ref("");

  if (!user.email.includes("@inspedralbes.cat")) {
    message.value = $t("LoginRegisterPage.invalidMail");
    messageType.value = "error";
  } else {
    try {
      const response = await loginAPI(userAPIs);

      if (response.error) {
        return;
      } else {
        succes = true;
      }

      let user = response.userLogin;
      let profile = user.profile;

      bannerURL.value = `${import.meta.env.VITE_URL_BACK}${user.banner}`;
      if (profile.includes("/upload/", 0)) {
        profileURL.value = `${import.meta.env.VITE_URL_BACK}${user.profile}`;
      } else {
        profileURL.value = user.profile;
      }

      user.profile = profileURL.value;
      user.banner = bannerURL.value;

      useAppStore().setAccessToken(response.accessToken);
      useAppStore().setRefreshToken(response.refreshToken);
      useAppStore().setUser(user);

      localStorage.setItem("user", JSON.stringify(user.email));
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
    } catch (error) {
      console.log(error.message);
    } finally {
      if (succes) {
        router.push({ name: "main" });
      }
    }
  }
}
</script>