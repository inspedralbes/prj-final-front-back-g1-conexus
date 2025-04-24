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
                <p><strong>Status:</strong> {{ report.status }}</p>
                <img v-if="report.image" :src="report.image" alt="Report Image" class="report-image" />
            </div>
        </div>
    </div>
</template>

<script>
import { getAllReports } from "@/services/communicationsScripts/incidentsManager";


export default {
    name: 'ViewReports',
    data(){
        return {
            reports: []
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
}
</script>