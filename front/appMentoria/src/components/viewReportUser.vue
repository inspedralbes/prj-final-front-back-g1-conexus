<template>
  <div
    class="container mx-auto p-3 sm:p-4 bg-containersTheme shadow-lg rounded-lg max-w-screen-xl"
  >
    <h1 class="text-2xl font-bold mb-5 text-textThemeColor dark:text-gray-100">
      {{ $t("ViewReportUser.title") }}
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-containersTheme">
      <div
        v-for="report in reports"
        :key="report.id"
        :class="[
          'bg-bgTheme border border-buttonColorPrimary rounded-lg p-5 mb-6 shadow-md',
          { 'dark:shadow-white': true },
        ]"
        :style="{
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(255, 255, 255, 0.3)',
        }"
      >
        <div class="flex flex-wrap justify-between mb-4">
          <div class="w-full md:w-1/2 mb-4">
            <p class="text-lg font-semibold text-textThemeColor">
              {{$t("ViewReportUser.reportN")}}{{ report.id }}
            </p>
          </div>
          <div class="w-full md:w-1/2 mb-4 md:mb-0 ">
            <p class="text-base font-semibold text-textThemeColor">
              {{ $t("ViewReportUser.status") }}
            </p>
            <select
              v-model="report.status"
              @change="updateReportStatus(report.id, report.status)"
              :class="{
                'bg-yellow-200 dark:bg-yellow-600 text-bgTheme': report.status === 'pending',
                'bg-blue-200 dark:bg-blue-300 text-bgTheme': report.status === 'revising',
                'bg-green-200 dark:bg-green-600 text-bgTheme': report.status === 'revised',
                'appearance-none bg-containersTheme text-bgTheme border border-buttonColorPrimary text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-buttonColorPrimary focus:border-buttonColorPrimary p-2 w-full md:w-32 shadow-sm': true,
              }"
            >
              <option value="pending" class="text-textThemeColor">{{ $t("ViewReportUser.pending") }}</option>
              <option value="revising" class="text-textThemeColor">{{ $t("ViewReportUser.reviewing") }}</option>
              <option value="revised" class="text-textThemeColor">{{ $t("ViewReportUser.reviewed") }}</option>
            </select>
          </div>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-textThemeColor">
            {{ $t("ViewReportUser.date") }}:
          </p>
          <p class="text-base text-textThemeColor">
            {{ report.created_at }}
          </p>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-textThemeColor">
            {{ $t("ViewReportUser.userReported") }}:
          </p>
          <p class="text-base text-textThemeColor">
            {{ report.reported_user_name }}
          </p>
          <p class="text-sm text-textThemeColor">
            {{ report.reported_user_email }}
          </p>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-textThemeColor">
            {{ $t("ViewReportUser.reportingUser") }}:
          </p>
          <p class="text-base text-textThemeColor">
            {{ report.reporting_user_name }}
          </p>
          <p class="text-sm text-textThemeColor">
            {{ report.reporting_user_email }}
          </p>
        </div>

        <div class="mb-3">
          <p class="text-sm font-semibold text-textThemeColor">
            {{ $t("ViewReportUser.report") }}:
          </p>
          <p class="text-base text-textThemeColor">
            {{ report.report }}
          </p>
        </div>

        <div class="flex justify-end">
          <button
            @click="deleteReport(report.id)"
            class="bg-red-500 text-textThemeColor px-4 py-2 rounded-md shadow-md hover:bg-red-600"
          >
            {{ $t("ViewReportUser.delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateReportUser } from "@/services/communicationsScripts/mainManager";
import { deleteReportUser } from "@/services/communicationsScripts/mainManager";
import { fetchAllUserReports } from "@/services/communicationsScripts/mainManager";
export default {
  data() {
    return {
      reports: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      const data = await fetchAllUserReports();
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
        const response = await updateReportUser(id, status);
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
        const response = await deleteReportUser(id);
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
