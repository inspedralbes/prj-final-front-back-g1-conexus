<template>
    <div class="animate-fade-in max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Cabecera -->
        <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1
                    class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Estadístiques d'incidències
                </h1>
                <p class="text-gray-300 mt-2">Visualitza el resum de les incidències per sala, mes i estat</p>
            </div>
            <router-link to="/"
                class="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tornar
            </router-link>
        </div>

        <!-- Incidencias por Sala -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700 mb-8">
            <h2 class="text-lg font-medium text-gray-300 mb-4">Incidències per Sala</h2>
            <div class="mx-auto w-full max-w-2xl h-[32rem] flex items-center justify-center">
                <Bar v-if="incidenciasPorSalaData.labels.length && incidenciasPorSalaData.datasets[0].data.length"
                    :data="incidenciasPorSalaData" :options="chartOptions" class="chart-container w-full h-full" />
                <div v-else class="text-gray-400 text-center w-full">No hi ha dades</div>
            </div>
        </div>

        <!-- Incidencias por Mes -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700 mb-8">
            <h2 class="text-lg font-medium text-gray-300 mb-4">Incidències per Mes</h2>
            <div class="mx-auto max-w-md h-80 flex items-center justify-center">
                <Bar v-if="incidenciasPorMes.labels.length && incidenciasPorMes.datasets[0].data.length"
                    :data="incidenciasPorMes" :options="chartOptions" class="chart-container" />
                <div v-else class="text-gray-400 text-center w-full">No hi ha dades</div>
            </div>
        </div>

        <!-- Pie Chart -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700 mb-8">
            <h2 class="text-lg font-medium text-gray-300 mb-4">Porcentatge d'incidències per estat</h2>
            <div class="mx-auto max-w-md h-80 flex items-center justify-center">
                <Pie v-if="incidenciasPorEstadoData.labels.length" :data="incidenciasPorEstadoData"
                    :options="pieOptions" class="chart-container" />
                <div v-else class="text-gray-400 text-center w-full">No hi ha dades</div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { Bar, Pie } from 'vue-chartjs'
import {
    Chart,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'
import { ref, onMounted } from 'vue'
import { getAllReports } from '@/services/communicationsScripts/incidentsManager.js'
import { getAllRooms } from '@/services/communicationsScripts/roomsManager.js'

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement)

const allReports = ref([])
const allRooms = ref([])
const incidenciasPorMes = ref({
    labels: [],
    datasets: [
        {
            label: 'Incidències per Mes',
            backgroundColor: '#FFB300',
            borderColor: '#FB8C00',
            borderWidth: 2,
            borderRadius: 8,
            data: []
        }
    ]
})
const incidenciasPorSalaData = ref({
    labels: [],
    datasets: [
        {
            label: 'Incidències per Sala',
            backgroundColor:
                '#6366f1'
            ,
            borderColor: '#1E88E5',
            borderWidth: 2,
            borderRadius: 8,
            data: []
        }
    ]
})

// Pie chart data
const incidenciasPorEstadoData = ref({
    labels: [],
    datasets: [
        {
            label: 'Porcentatge per Estat',
            backgroundColor: [
                'rgba(34,197,94,0.7)',      // green
                'rgba(239,68,68,0.7)',      // red
                'rgba(253,224,71,0.7)',     // yellow
                'rgba(251,146,60,0.7)',     // orange
                'rgba(168,139,250,0.7)'     // purple
            ],
            borderColor: [
                'rgba(34,197,94,1)',
                'rgba(239,68,68,1)',
                'rgba(253,224,71,1)',
                'rgba(251,146,60,1)',
                'rgba(168,139,250,1)'
            ],
            borderWidth: 1,
            data: []
        }
    ]
})

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: true, labels: { color: '#fff', font: { size: 16 } } },
        title: { display: false }
    },
    scales: {
        x: {
            grid: { display: false, color: '#374151' },
            ticks: { color: '#fff', font: { size: 14 } }
        },
        y: {
            beginAtZero: true,
            grid: { color: '#374151' },
            ticks: { color: '#fff', font: { size: 14 } }
        }
    },
    elements: {
        bar: {
            borderRadius: 8,
            borderSkipped: false
        }
    }
}

const pieOptions = {
    responsive: true,
    plugins: {
        legend: { display: true, labels: { color: '#fff', font: { size: 16 } } },
        title: { display: false }
    }
}

onMounted(async () => {
    allReports.value = await getAllReports()
    allRooms.value = await getAllRooms()

    // Crear un mapa de room_id a nombre de sala
    const roomIdToName = {}
    allRooms.value.forEach(room => {
        roomIdToName[room.id] = room.room_name
    })

    // Agrupar incidencias por sala usando el nombre de la sala
    const incidenciasPorSala = {}
    allReports.value.forEach(report => {
        if (report.room_id) {
            const roomName = roomIdToName[report.room_id] || `Sala ${report.room_id}`
            if (!incidenciasPorSala[roomName]) {
                incidenciasPorSala[roomName] = 0
            }
            incidenciasPorSala[roomName]++
        }
    })

    // Actualizar datos para la gráfica por sala usando nombres
    incidenciasPorSalaData.value.labels = Object.keys(incidenciasPorSala)
    incidenciasPorSalaData.value.datasets[0].data = Object.values(incidenciasPorSala)

    // Agrupar incidencias por estado
    const incidenciasPorEstado = {}
    allReports.value.forEach(report => {
        const estado = report.status || 'Desconegut'
        if (!incidenciasPorEstado[estado]) {
            incidenciasPorEstado[estado] = 0
        }
        incidenciasPorEstado[estado]++
    })
    incidenciasPorEstadoData.value.labels = Object.keys(incidenciasPorEstado)
    incidenciasPorEstadoData.value.datasets[0].data = Object.values(incidenciasPorEstado)

    // Agrupar incidencias por mes
    const incidenciasPorMesMap = {}
    allReports.value.forEach(report => {
        // Reemplazar espacio por 'T' para formato ISO válido
        const fechaStr = report.createdAt.replace(' ', 'T')
        const fecha = new Date(fechaStr)
        // Obtener mes y año para evitar duplicados de años diferentes
        const mes = fecha.toLocaleString('ca-ES', { month: 'long', year: 'numeric' })
        if (!incidenciasPorMesMap[mes]) {
            incidenciasPorMesMap[mes] = 0
        }
        incidenciasPorMesMap[mes]++
    })

    // Ordenar por cantidad de incidencias (descendente)
    const sortedMeses = Object.entries(incidenciasPorMesMap)
        .sort((a, b) => b[1] - a[1])

    incidenciasPorMes.value.labels = sortedMeses.map(([mes]) => mes)
    incidenciasPorMes.value.datasets[0].data = sortedMeses.map(([, cantidad]) => cantidad)
})
</script>
