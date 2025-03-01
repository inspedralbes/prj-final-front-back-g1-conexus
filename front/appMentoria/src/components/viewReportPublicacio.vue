<template>
  <div
    class="container mx-auto p-3 sm:p-4 bg-containersTheme shadow rounded-lg"
  >
    <h1 class="text-lg sm:text-xl font-bold mb-3 text-textThemeColor">
      {{ $t("ViewReportPublicacio.title") }}
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="report in reports"
        :key="report.id"
        :class="[
          'bg-bgTheme border border-buttonColorPrimary rounded-lg p-5 mb-6 shadow-md',
          { 'dark:shadow-white': true },
        ]"
        :style="{
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(255, 255, 255, 0.2)',
        }"
      >
        <div class="flex flex-wrap justify-between mb-4">
          <div class="w-1/2 sm:w-1/2 mb-4">
            <p class="text-lg font-semibold text-textThemeColor">
              {{ $t("ViewReportPublicacio.reportN") }}:
            </p>
            <p class="text-textThemeColor text-base">
              {{ report.id }}
            </p>
          </div>
          <div class="w-full md:w-1/2 mb-4 md:mb-0">
            <p class="text-base font-semibold text-textThemeColor">
              {{ $t("ViewReportPublicacio.status") }}
            </p>
            <select
              v-model="report.status"
              @change="updateReportStatus(report.id, report.status)"
              :class="{
                'bg-yellow-200 dark:bg-yellow-600': report.status === 'pending',
                'bg-blue-200': report.status === 'revising',
                'bg-green-200 dark:bg-green-600': report.status === 'revised',
                'appearance-none bg-containersTheme border border-buttonColorPrimary text-bgTheme text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-full md:w-32 shadow-sm': true,
              }"
            >
              <option value="pending">
                {{ $t("ViewReportPublicacio.pending") }}
              </option>
              <option value="revising">
                {{ $t("ViewReportPublicacio.reviewing") }}
              </option>
              <option value="revised">
                {{ $t("ViewReportPublicacio.reviewed") }}
              </option>
            </select>
          </div>
          <div class="w-full sm:w-1/3 mt-1">
            <p class="text-base font-semibold text-textThemeColor">
              {{ $t("ViewReportPublicacio.date") }}:
            </p>
            <p class="text-textThemeColor text-sm mt-1">
              {{ report.created_at }}
            </p>
          </div>
        </div>
        <div class="mb-6">
          <p class="text-base font-semibold text-textThemeColor">
            {{ $t("ViewReportPublicacio.userReporting") }}:
          </p>
          <p class="text-textThemeColor text-sm">
            {{ report.reporting_user_name }}
          </p>
          <p class="text-xs text-textThemeColor">
            {{ report.reporting_user_email }}
          </p>
        </div>
        <div class="mb-6">
          <p class="text-base font-semibold text-textThemeColor">
            {{ $t("ViewReportPublicacio.userPost") }}:
          </p>
          <p class="text-textThemeColor text-sm">
            {{ report.publication_user_name }}
          </p>
          <p class="text-xs text-textThemeColor">
            {{ report.publication_user_email }}
          </p>
        </div>
        <div class="mb-6">
          <p class="text-base font-semibold text-textThemeColor">
            {{ $t("ViewReportPublicacio.postTitle") }}
          </p>
          <p class="text-textThemeColor text-sm">
            {{ report.title }}
          </p>
        </div>
        <div class="mb-6">
          <p class="text-base font-semibold text-textThemeColor">
            {{ $t("ViewReportPublicacio.postDescription") }}
          </p>
          <p class="text-textThemeColor text-sm">
            {{ report.description }}
          </p>
        </div>
        <div class="mb-6">
          <p class="text-basee font-semibold text-textThemeColor">
            {{ $t("ViewReportPublicacio.report") }}:
          </p>
          <p class="text-textThemeColor text-sm">
            {{ report.report }}
          </p>
        </div>
        <div class="mb-6">
          <p class="text-base font-semibold text-textThemeColor">
            {{ $t("ViewReportPublicacio.reportedImage") }}:
          </p>
          <select
            v-model="report.selectedImage"
            class="appearance-none bg-bgTheme border border-buttonColorPrimary text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-full shadow-sm"
          >
            <option :value="null">Selecciona una imatge</option>
            <option :value="`${communityUrl}${report.image}`">
              {{ $t("ViewReportPublicacio.viewImage") }}
            </option>
          </select>
          <img
            v-if="report.selectedImage"
            :src="report.selectedImage"
            alt="Imatge Reportada"
            class="w-32 h-auto rounded-md shadow-sm mt-2"
          />
        </div>
        <div class="flex justify-end">
          <button
            @click="deleteReport(report.id)"
            class="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
          >
            {{ $t("ViewReportPublicacio.delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { updateReportPublication } from "@/services/communicationsScripts/communityManager";
import { deleteReportPublication } from "@/services/communicationsScripts/communityManager";
import { fetchAllReportsPublications } from "@/services/communicationsScripts/communityManager";

export default {
  data() {
    return {
      reports: [],
      loading: true,
      communityUrl: import.meta.env.VITE_URL_BACK_COMMUNITY.replace(/\/$/, ""),
    };
  },
  async mounted() {
    try {
      const data = await fetchAllReportsPublications();
      if (data.error) {
        console.error(data.error);
      } else {
        this.reports = data;
      }
    } catch (error) {
      console.error("Error al obtenir els informes:", error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async updateReportStatus(id, status) {
      try {
        const response = await updateReportPublication(id, status);
        if (response.error) {
          console.error(response.error);
        } else {
          console.log("Estat actualitzat correctament");
        }
      } catch (error) {
        console.error("Error al actualitzar l'estat:", error);
      }
    },

    async deleteReport(id) {
      try {
        const response = await deleteReportPublication(id);
        if (response.error) {
          console.error(response.error);
        } else {
          this.reports = this.reports.filter((report) => report.id !== id);
          console.log("Informe eliminat correctament");
        }
      } catch (error) {
        console.error("Error al eliminar l'informe:", error);
      }
    },
  },
};
</script>