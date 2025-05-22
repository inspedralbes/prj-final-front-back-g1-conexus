<template>
  <div class="card animate-fade-in">
    <div class="card-header">
      <div class="room-icon">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div class="room-info">
        <h3 class="room-title">{{ props.room.room_name }}</h3>
        <p class="room-desc">{{ props.room.room_description }}</p>
      </div>
    </div>

    <div class="availability-section">
      <h4 class="section-title">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Disponibilitat
      </h4>

      <div class="schedule-grid">
        <div v-if="props.room.room_hours_available_monday?.length" class="day-schedule">
          <h5 class="day-title">Dilluns</h5>
          <div class="hours-list">
            <span v-for="hour in props.room.room_hours_available_monday" :key="hour" class="hour-tag">
              {{ hour }}
            </span>
          </div>
        </div>

        <div v-if="props.room.room_hours_available_tuesday?.length" class="day-schedule">
          <h5 class="day-title">Dimarts</h5>
          <div class="hours-list">
            <span v-for="hour in props.room.room_hours_available_tuesday" :key="hour" class="hour-tag">
              {{ hour }}
            </span>
          </div>
        </div>

        <div v-if="props.room.room_hours_available_wednesday?.length" class="day-schedule">
          <h5 class="day-title">Dimecres</h5>
          <div class="hours-list">
            <span v-for="hour in props.room.room_hours_available_wednesday" :key="hour" class="hour-tag">
              {{ hour }}
            </span>
          </div>
        </div>

        <div v-if="props.room.room_hours_available_thursday?.length" class="day-schedule">
          <h5 class="day-title">Dijous</h5>
          <div class="hours-list">
            <span v-for="hour in props.room.room_hours_available_thursday" :key="hour" class="hour-tag">
              {{ hour }}
            </span>
          </div>
        </div>

        <div v-if="props.room.room_hours_available_friday?.length" class="day-schedule">
          <h5 class="day-title">Divendres</h5>
          <div class="hours-list">
            <span v-for="hour in props.room.room_hours_available_friday" :key="hour" class="hour-tag">
              {{ hour }}
            </span>
          </div>
        </div>
      </div>

      <button @click="openReservationModal" class="reserve-button">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Reservar
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['open-reservation']);

function openReservationModal() {
  emit('open-reservation', props.room);
}
</script>

<style scoped>
.card {
  background: rgba(30, 41, 59, 0.85);
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card-header {
  padding: 1.5rem;
  background: rgba(51, 65, 85, 0.5);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.room-icon {
  background: rgba(59, 130, 246, 0.1);
  padding: 1rem;
  border-radius: 0.75rem;
  color: #60A5FA;
  flex-shrink: 0;
}

.room-info {
  flex: 1;
}

.room-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 0.5rem;
}

.room-desc {
  color: #94A3B8;
  font-size: 1rem;
  line-height: 1.5;
}

.availability-section {
  padding: 1.5rem;
  background: rgba(51, 65, 85, 0.3);
}

.section-title {
  display: flex;
  align-items: center;
  color: #E2E8F0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.day-schedule {
  background: rgba(51, 65, 85, 0.3);
  padding: 1.25rem;
  border-radius: 0.75rem;
}

.day-title {
  color: #94A3B8;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.hours-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hour-tag {
  background: rgba(59, 130, 246, 0.1);
  color: #60A5FA;
  padding: 0.35rem 0.85rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.reserve-button {
  width: 100%;
  background: linear-gradient(to right, #3B82F6, #2563EB);
  color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.reserve-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
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
</style>
