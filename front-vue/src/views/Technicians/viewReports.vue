<template>
    <div>
        <h1>Reports</h1>
        <div v-if="reports.length === 0" class="no-reports-message">
            <p>No reports available.</p>

        </div>
        <div v-else class="reports-list">
            <div v-for="report in reports" :key="report.id" class="report-item">
                <h2>Report ID: {{ report.id }}</h2>
                <p>User: {{ report.User.name }}</p>
                <p><strong>Description:</strong> {{ report.report }}</p>
                <p><strong>Room:</strong> {{ report.Room.room_name}}</p>
                <p><strong>Status:</strong></p>

                <select v-model="report.status" @change="updateReportStatus(report.id, report.status)" class="status-selector">
                    <option value="pending">Pending</option>
                    <option value="revised">Revised</option>
                    <option value="completed">Completed</option>
                </select>
                <img v-if="report.image" :src="`${baseURL}${report.image}`" alt="Report Image" class="report-image" />
            
                <button @click="deleteReport(report.id)">Elimina</button>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteReport, getAllReports, updateReport } from "@/services/communicationsScripts/incidentsManager";


export default {
    name: 'ViewReports',
    data(){
        return {
            reports: [],
            baseURL: import.meta.env.VITE_INCIDENT_URL,
        };
    },

    async created() {
        try {
            this.reports = await getAllReports();
            console.log("Reports fetched successfully:", this.reports);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    },

    methods: {
        async deleteReport(reportId) {
            try {
                await deleteReport(reportId);
                this.reports = this.reports.filter(report => report.id !== reportId);
                console.log("Report deleted successfully:", reportId);
            } catch (error) {
                console.error("Error deleting report:", error);
            }
        },

        async updateReportStatus(reportId, status) {
            try {
                await updateReport(reportId, { status });
                const report = this.reports.find(report => report.id === reportId);
                if (report) {
                    report.status = status;
                }
                console.log("Report status updated successfully:", reportId);
            } catch (error) {
                console.error("Error updating report status:", error);
            }
        },
    },
}
</script>