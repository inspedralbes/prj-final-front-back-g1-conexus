<template>
  <div
    class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30 mt-9 mb-9"
  >
    <!-- Capçalera -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400"
          >
            Assistència al curs
          </span>
          <span class="ml-2 text-white">{{ hoursAvailable.course_name }}</span>
        </h2>
        <p class="text-gray-400 text-sm">
          Gestió del control d'assistència dels alumnes
        </p>
      </div>
      <div class="flex items-center gap-4">
        <router-link to="/teachers/assistence">
          <button
            class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Tornar a assistència
          </button>
        </router-link>
        <div class="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
          <svg
            class="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Selector de data i hora -->
    <div class="mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
      <h3 class="text-lg font-semibold text-white mb-4">
        Selecció de data i hora
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Selector de data -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-300 mb-2"
            >Data de classe:</label
          >
          <div class="relative">
            <input
              type="date"
              id="date"
              v-model="selectedDate"
              @change="getAttendanceOfTheDay()"
              class="w-full pl-12 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <!-- Selector d'hora o missatge de no disponibilitat -->
        <div v-if="thereIsClassThatDay()">
          <label for="hour" class="block text-sm font-medium text-gray-300 mb-2"
            >Hora de classe:</label
          >
          <div class="relative">
            <select
              id="hour"
              v-model="selectedHour"
              @change="updateSelectedHour"
              class="w-full pl-12 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
            >
              <option
                v-for="hour in hoursAvailable[
                  selectedDate &&
                    new Date(selectedDate)
                      .toLocaleString('en-US', { weekday: 'long' })
                      .toLowerCase()
                ] || []"
                :key="hour"
              >
                {{ hour }}
              </option>
            </select>
            <svg
              class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              class="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div v-else class="flex items-center">
          <div
            class="bg-amber-500/10 text-amber-300 px-4 py-3 rounded-lg border border-amber-500/20 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>No hi ha classe aquest dia</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Llista d'assistència -->
    <div class="attendance-list">
      <div
        v-if="
          attendance != null &&
          hoursAvailable != null &&
          thereIsClassAtThatHour()
        "
        class="bg-slate-800/50 rounded-xl border border-slate-700/30 overflow-hidden"
      >
        <div class="p-4 bg-slate-700/50 border-b border-slate-600/50">
          <h3 class="text-lg font-semibold text-white">Llista d'alumnes</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-700/30 border-b border-slate-600/50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Nom
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Estat
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr
                v-for="student in students"
                :key="student.user_id"
                class="hover:bg-slate-700/20 transition-colors"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white"
                >
                  {{ student.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center justify-between w-full">
                    <!-- Dropdown de selección a la izquierda -->
                    <select
                      v-model="student.attendance"
                      @change="
                        sendUpdateAtendance(student.user_id, student.attendance)
                      "
                      class="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    >
                      <option value="not selected">No seleccionat</option>
                      <option value="unjustified" class="text-red-400">
                        Falta
                      </option>
                      <option value="late" class="text-amber-400">
                        Retard
                      </option>
                      <option value="yes" class="text-green-400">
                        Present
                      </option>
                      <option value="justified" class="text-blue-400">
                        Falta justificada
                      </option>
                    </select>

                    <!-- Indicador de estado posicionado a la derecha -->
                    <span
                      v-if="
                        student.attendance &&
                        student.attendance !== 'not selected'
                      "
                      :class="{
                        'px-3 py-1 rounded-full text-xs font-medium': true,
                        'bg-red-500/20 text-red-300':
                          student.attendance === 'unjustified',
                        'bg-amber-500/20 text-amber-300':
                          student.attendance === 'late',
                        'bg-green-500/20 text-green-300':
                          student.attendance === 'yes',
                        'bg-blue-500/20 text-blue-300':
                          student.attendance === 'justified',
                      }"
                    >
                      {{
                        student.attendance === "unjustified"
                          ? "Falta"
                          : student.attendance === "late"
                          ? "Retard"
                          : student.attendance === "yes"
                          ? "Present"
                          : student.attendance === "justified"
                          ? "Falta justificada"
                          : ""
                      }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estado de carga o mensaje de no resultados -->
      <div
        v-else-if="!thereIsClassAtThatHour() && thereIsClassThatDay()"
        class="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/30"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-lg text-gray-300 mb-2">Selecciona una hora vàlida</p>
        <p class="text-sm text-gray-400">
          No hi ha classe a l'hora seleccionada
        </p>
      </div>

      <div
        v-else-if="!thereIsClassThatDay()"
        class="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/30"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <p class="text-lg text-gray-300 mb-2">No hi ha classes aquest dia</p>
        <p class="text-sm text-gray-400">
          Selecciona un altre dia del calendari
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/index.js";
import { onMounted, ref } from "vue";
import {
  getHoursOfCourse,
  getAlumns,
} from "@/services/communicationsScripts/mainManager";
import {
  getAttendanceFromDay,
  updateAttendance,
} from "@/services/communicationsScripts/attendanceComManager.js";

const selectedDate = ref(new Date().toISOString().substr(0, 10));
const attendance = ref([]);
const hoursAvailable = ref([]);
const selectedHour = ref(null);
const students = ref([]);
const route = useRoute();
const courseId = route.params.courseId;
const router = useRouter();

onMounted(async () => {
  try {
    // Cargar horarios disponibles
    hoursAvailable.value = await getHoursOfCourse(courseId);

    // Cargar estudiantes
    students.value = await getAlumns(courseId);

    // Inicializar todos los estudiantes con asistencia "not selected"
    students.value.forEach((student) => {
      student.attendance = "not selected";
    });

    // Si no hay hora seleccionada pero hay clases este día, seleccionar la primera hora disponible
    if (!selectedHour.value && thereIsClassThatDay()) {
      const dayOfWeek = new Date(selectedDate.value)
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase();

      if (
        hoursAvailable.value[dayOfWeek] &&
        hoursAvailable.value[dayOfWeek].length > 0
      ) {
        selectedHour.value = hoursAvailable.value[dayOfWeek][0];
        console.log(
          "Primera hora seleccionada automáticamente:",
          selectedHour.value
        );
      }
    }

    // Cargar datos de asistencia si hay una hora seleccionada
    if (selectedHour.value) {
      console.log("Cargando asistencia inicial con hora:", selectedHour.value);

      // Pequeño retraso para asegurar que todos los componentes estén listos
      setTimeout(() => {
        getAttendanceOfTheDay();
      }, 100);
    }
  } catch (error) {
    console.error("Error al inicializar:", error);
  }
});

// MANTENER la función original getAttendanceOfTheDay para compatibilidad
async function getAttendanceOfTheDay() {
  try {
    const date = new Date(selectedDate.value).toISOString();
    const data = await getAttendanceFromDay(courseId, date);

    if (!data || !data.length) {
      console.log("No hay datos de asistencia para esta fecha/hora");
      return;
    }

    // Imprimir el primer registro para depuración
    if (data[0]) {
      console.log(
        "Estructura de datos recibida (ejemplo):",
        JSON.stringify(data[0], null, 2)
      );
    }

    // Filtrar registros por la hora seleccionada
    const hourToFind = selectedHour.value
      ? selectedHour.value.split(" ")[0].trim()
      : "";
    const recordsForHour = data.filter(
      (record) => record.hour && record.hour.trim() === hourToFind
    );

    console.log("Registros para hora " + hourToFind + ":", recordsForHour);

    // Crear un mapa para almacenar el registro más reciente por estudiante
    const latestRecordMap = new Map();

    // Procesar cada registro para encontrar el más reciente para cada estudiante
    recordsForHour.forEach((record) => {
      // CORRECCIÓN: Usar user_id en lugar de student_id
      const studentId = String(record.user_id);
      const currentRecord = latestRecordMap.get(studentId);

      if (studentId && record.assisted) {
        // Si no tenemos registro para este estudiante o este es más reciente, actualizarlo
        if (
          !currentRecord ||
          new Date(record.updatedAt) > new Date(currentRecord.updatedAt)
        ) {
          latestRecordMap.set(studentId, record);
          console.log(
            `Registro más reciente para estudiante ID ${studentId}: ${record.assisted} (${record.updatedAt})`
          );
        }
      } else {
        console.log("Registro inválido o sin ID:", record);
      }
    });

    // Aplicar el estado más reciente a cada estudiante
    students.value.forEach((student) => {
      const studentId = String(student.user_id);
      const latestRecord = latestRecordMap.get(studentId);

      if (latestRecord) {
        // Usar el campo assisted directamente
        student.attendance = latestRecord.assisted;
        console.log(
          `Asignando a ${student.name} (ID: ${studentId}) el estado: ${student.attendance}`
        );
      }
    });
  } catch (error) {
    console.error("Error al cargar asistencia:", error);
  }
}

function thereIsClassThatDay() {
  console.log("Selected date: ", selectedDate.value);
  console.log("Hours available: ", hoursAvailable.value);
  const dayOfWeek = new Date(selectedDate.value)
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();
  switch (dayOfWeek) {
    case "monday":
      return hoursAvailable.value.monday != null;
    case "tuesday":
      return hoursAvailable.value.tuesday != null;
    case "wednesday":
      return hoursAvailable.value.wednesday != null;
    case "thursday":
      return hoursAvailable.value.thursday != null;
    case "friday":
      return hoursAvailable.value.friday != null;
    case "saturday":
      return hoursAvailable.value.saturday != null;
    case "sunday":
      return hoursAvailable.value.sunday != null;
    default:
      return false;
  }
}

function thereIsClassAtThatHour() {
  const dayOfWeek = new Date(selectedDate.value)
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();
  const selectedHourValue = selectedHour.value;
  return (
    hoursAvailable.value[dayOfWeek] &&
    hoursAvailable.value[dayOfWeek].some((hourRange) =>
      hourRange.includes(selectedHourValue)
    )
  );
}

function sendUpdateAtendance(id, status) {
  try {
    // Buscar el estudiante por ID
    const student = students.value.find(
      (s) => String(s.user_id) === String(id)
    );

    if (!student) {
      console.error(`Error: No se encontró estudiante con ID: ${id}`);
      return;
    }

    // Actualizar inmediatamente en la UI
    student.attendance = status;

    // Obtener la fecha y hora correctamente formateadas
    const hour = selectedHour.value
      ? selectedHour.value.split(" ")[0].trim()
      : "";
    const date = selectedDate.value.split("T")[0];

    console.log(`Enviando actualización de asistencia:
      • Estudiante: ${student.name} (ID: ${id})
      • Estado: ${status}
      • Hora: ${hour}
      • Fecha: ${date}
      • Curso: ${courseId}
    `);

    // Enviar al servidor - Asegurar que usamos el ID correcto (user_id)
    updateAttendance(courseId, id, hour, status, date)
      .then((response) => {
        console.log(`✅ Asistencia actualizada con éxito`);

        // Recargar datos para mostrar el estado actualizado
        setTimeout(() => {
          getAttendanceOfTheDay();
        }, 500);
      })
      .catch((error) => {
        console.error(`❌ Error al actualizar asistencia:`, error);

        // Restaurar estado anterior en caso de error
        getAttendanceOfTheDay();
      });
  } catch (error) {
    console.error("Error en sendUpdateAtendance:", error);
  }
}

function updateSelectedHour() {
  console.log(`Hora seleccionada: ${selectedHour.value}`);
  // Cargar asistencia para la hora seleccionada
  getAttendanceOfTheDay();
}
</script>

<style scoped>
/* Animació d'aparició */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estils per inputs de tipus date en mode fosc */
input[type="date"] {
  color-scheme: dark;
}
</style>

