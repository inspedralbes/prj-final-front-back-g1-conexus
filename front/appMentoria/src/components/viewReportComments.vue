<template>
  <div
    class="container mx-auto p-3 sm:p-4 bg-white dark:bg-gray-700 shadow-lg rounded-lg max-w-screen-xl"
  >
    <h1 class="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
    {{ $t('ViewReportComments.title') }}
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="report in reports"
        :key="report.id"
        :class="[
          'bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-300 rounded-lg p-5 mb-6 shadow-md',
          { 'dark:shadow-white': true },
        ]"
        :style="{
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(255, 255, 255, 0.2)',
        }"
      >
        <div class="flex flex-wrap justify-between mb-4">
          <div class="w-full md:w-1/2 mb-4">
            <p class="text-lg font-semibold text-gray-800 dark:text-gray-300">
              {{ $t('ViewReportComments.reportN') }} : {{ report.id }}
            </p>
          </div>
          <div class="w-full md:w-1/2 mb-4 md:mb-0">
            <p class="text-base font-semibold text-gray-900 dark:text-gray-300">
              {{ $t('ViewReportComments.status') }}:
            </p>
            <select
              v-model="report.status"
              @change="updateReportStatus(report.id, report.status)"
              :class="{
                'bg-yellow-200 dark:bg-yellow-600': report.status === 'pending',
                'bg-blue-400 dark:bg-blue-500': report.status === 'revising',
                'bg-green-200 dark:bg-green-600': report.status === 'revised',
                'appearance-none bg-gray-100 dark:bg-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-full md:w-32 shadow-sm': true,
              }"
            >
              <option value="pending">{{ $t("ViewReportComments.pending") }}</option>
              <option value="revising">{{$t("ViewReportComments.reviewing")}}</option>
              <option value="revised">{{$t("ViewReportComments.reviewed")}}</option>
            </select>
          </div>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
          {{ $t('ViewReportComments.date') }}:
          </p>
          <p class="text-base text-gray-800 dark:text-gray-200">
            {{ report.created_at }}
          </p>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
          {{ $t('ViewReportComments.comment') }}
          </p>
          <p class="text-base text-gray-800 dark:text-gray-200">
            {{ report.comment }}
          </p>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
          {{ $t('ViewReportComments.reportingUser') }}
          </p>
          <p class="text-base text-gray-800 dark:text-gray-200">
            {{ report.reporting_user_name }}
          </p>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
          {{ $t('ViewReportComments.commentUser') }}
          </p>
          <p class="text-base text-gray-800 dark:text-gray-200">
            {{ report.comment_user_name }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ report.comment_user_email }}
          </p>
        </div>

        <div class="mb-3">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
          {{ $t('ViewReportComments.report') }}
          </p>
          <p class="text-base text-gray-800 dark:text-gray-200">
            {{ report.report }}
          </p>
        </div>

        <div class="flex justify-end">
          <button
            @click="deleteReport(report.id)"
            class="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
          >
          {{ $t('ViewReportComments.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateReportComment } from "@/services/communicationsScripts/mainManager";
import { deleteReportComment } from "@/services/communicationsScripts/mainManager";
import { fetchAllReportsComments } from "@/services/communicationsScripts/mainManager";

export default {
  data() {
    return {
      reports: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      const data = await fetchAllReportsComments();
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
        const response = await updateReportComment(id, status);
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
        const response = await deleteReportComment(id);
        if (response.error) {
          console.error(response.error);
        } else {
          this.reports = this.reports.filter((report) => report.id !== id);
        }
      } catch (error) {
        console.error("Error al eliminar l'informe:", error);
      }
    },
  },
};
</script>