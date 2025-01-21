<template>
  <div class="h-screen flex items-center justify-center p-8">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <form @submit.prevent="saveForm">
        <!-- Post Content Section -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2"
            >Afegeix una Publicació:</label
          >
          <div class="pb-4">
            <textarea
              id="title"
              name="postContent"
              rows="1"
              class="w-full border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500"
              placeholder="Títol"
              required
            ></textarea>
          </div>
          <div>
            <textarea
              id="des"
              name="postContent"
              rows="4"
              class="w-full border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500"
              placeholder="En que hi penses?"
              required
            ></textarea>
          </div>
        </div>
        <!-- Tags Section -->
        <div class="mb-6">
          <!-- TAGS -->
        </div>

        <!-- Submit Button and Character Limit Section -->
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="flex justify-center items-center bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue text-white py-2 px-4 rounded-md transition duration-300 gap-2"
          >
            Post
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <span class="text-gray-500 text-sm">Max 280 characters</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postContent: {
        typesPublications_id: "",
        title: "",
        description: "",
        user_id: "",
      },
    };
  },
  methods: {
    saveForm(event) {
      event.preventDefault();
      const formData = {
        typesPublications_id: 1,
        title: document.getElementById("title").value,
        description: document.getElementById("des").value,
        user_id: 0,
      };
    },
  },
};
</script>
<style scoped>
.create-post {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 15px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #737272;
  border-radius: 5px;
  resize: none;
}
</style>