<template>
  <div class="container animate-fade-in">
    <h1>Nova Tasca</h1>
    <button class="back-btn" @click="goBack()">Tornar</button>
    <div class="form-group">
      <label for="taskName">Nom de la tasca:</label>
      <input type="text" id="task_name" v-model="task_name" />
    </div>
    <div class="form-group">
      <label for="taskDescription">Descripció:</label>
      <textarea id="taskDescription" v-model="task_description"></textarea>
    </div>
    <button class="create-btn" @click="sendCreateTask">Crear Tasca</button>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { createTask } from "@/services/communicationsScripts/gradesComManager.js";
import { useRouter } from "vue-router";
const task_name = ref("");
const task_description = ref("");
const courseId = ref(null);
const router = useRouter();
onMounted(() => {
  const route = useRoute();
  courseId.value = route.params.courseId;
});

function sendCreateTask() {
  const task = {
    task_name: task_name.value,
    task_description: task_description.value,
    course_id: courseId.value,
  };
  createTask(task).then(() => {
    router.push({ name: "grades", params: { courseId: courseId.value } });
  });
}
function goBack() {
  router.push({ name: "grades", params: { courseId: courseId.value } });
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

/* Semitransparent background and dark theme styles */
.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 32px 24px;
  background: rgba(30, 41, 59, 0.85); /* dark blue-gray, semitransparent */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  color: #e2e8f0; /* light text */
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  text-align: center;
  color: #f1f5f9;
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 1rem;
  font-weight: 500;
  color: #cbd5e1;
  user-select: none;
}

input[type="text"],
textarea {
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 6px;
  font-size: 1rem;
  background: #1e293b;
  color: #e2e8f0;
  transition: border 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #2563eb;
  outline: none;
  background: #0f172a;
  box-shadow: 0 0 0 2px #2563eb33;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.back-btn {
  align-self: flex-start;
  background: #334155;
  color: #60a5fa;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

.back-btn:hover {
  background: #1e293b;
  color: #93c5fd;
  transform: translateY(-1px);
}

.create-btn {
  background: #2563eb;
  color: #f1f5f9;
  border: none;
  padding: 10px 0;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

.create-btn:hover {
  background: #1d4ed8;
  color: #fff;
  transform: translateY(-1px);
}

/* Table styles for consistency if used */
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  background: rgba(17, 24, 39, 0.7);
  border-radius: 6px;
  overflow: hidden;
  color: #e2e8f0;
}

th,
td {
  border: 1px solid #334155;
  padding: 8px;
  color: #e2e8f0;
}

th {
  background-color: rgba(51, 65, 85, 0.85);
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.5px;
}

td {
  text-align: left;
  background: rgba(30, 41, 59, 0.6);
}

tr > td:last-child,
tr > td:nth-last-child(2) {
  white-space: nowrap;
}

/* Smooth transitions for form elements */
input,
textarea,
select,
button {
  transition: all 0.2s ease;
}

/* Efectes hover */
button:hover {
  transform: translateY(-1px);
}
</style>