<template>
    <div class="grades">
        <h1>Assistencia</h1>
        <p>Aquí pots veure la teva asistencia a un curs</p>
        <button @click="goToHome()">Tornar</button>
        <table  class="table table-striped table-bordered table-hover">
            <tr>
                <th>Dia</th>
                <th>
                <th>Hora</th>
                <th>Asistencia</th>
                </th>

            </tr>
            <tr v-for="hour in assistance">
                <td>
                    {{ new Date(hour.day).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
                </td>
                <td>
                <td>{{ hour.hour }}</td>
                <td>
                    {{ hour.assisted === 'yes' ? 'present' :
                        hour.assisted === 'unjustified' ? 'falta sense justificar' :
                            hour.assisted === 'justified' ? 'falta justificada' :
                                hour.assisted === 'late' ? 'retard' : '' }}
                </td>
                </td>
            </tr>
            <tr>
                <td>Percentatge d'hores Assistides: </td>{{ calculateHoursAssisted() }}%<td></td>
            </tr>
            <tr>
                <td>Percentatge d'hores sense justificar: </td>
                <td>{{ calculateHoursNotJustified() }}%</td>
            </tr>
        </table>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/index.js';
import { getAttendanceFromUserAndCourse } from '@/services/communicationsScripts/attendanceComManager.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const courseId = ref(null);
const assistance = ref([]);
const appStore=useAppStore()
onMounted(async () => {
    const route = useRoute();
    courseId.value = route.params.id;
    console.log(courseId.value);
    assistance.value = await getAttendanceFromUserAndCourse(appStore.user.id, route.params.id);
});
function goToHome() {
    router.push({ name: 'student-assistence' });
}
function calculateHoursAssisted() {
    let totalHours = 0;
    let assistedHours = 0;
    assistance.value.forEach(hour => {
        if (hour.assisted == "yes") {
            assistedHours++;
        }
        totalHours++;
    });
    return (assistedHours / totalHours) * 100;
}
function calculateHoursNotJustified() {
    let totalHours = 0;
    let notJustifiedHours = 0;
    let lateDiscount = 0;
    assistance.value.forEach(hour => {
        if (hour.assisted == "unjustified") {
            notJustifiedHours++;
        }
        if (hour.assisted == "late") {
            lateDiscount++;
            if (lateDiscount > 2) {
                notJustifiedHours++;
                lateDiscount = 0;
            }
        }
        totalHours++;
    });
    return (notJustifiedHours / totalHours) * 100;
}
</script>
<style scoped>
.table {
    width: 100%;
    border-collapse: collapse;
}
.table tr{
    border-bottom: 1px solid #ddd;
}


</style>