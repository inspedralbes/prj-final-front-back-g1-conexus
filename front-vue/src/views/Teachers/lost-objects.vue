<template>
    <div>
       <h1>Objecte perdut</h1> 

        <form @submit.prevent="submitReport" class="report-form" enctype="multipart/form-data">
            <div class="form-group">
                <label for="report">Descripció de l'objecte</label>
                <textarea id="report" v-model="reportData.report" required placeholder="Descripció de l'objecte..."
                    class="form-control text-gray-900"></textarea>
            </div>

            <div class="form-group text-gray-900">
                <label for="room_id">ID de la sala</label>
                <input type="number" id="room_id" v-model.number="reportData.room_id" required class="form-control" />
            </div>

            <!-- Nuevo campo para subir imágenes -->

            <div class="form-group">
                <label for="upload-image">Pujar imatge</label>
                <input type="file" id="upload-image" @change="handleFileUpload" class="form-control text-gray-900" />
            </div>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? 'Enviant...' : 'Enviar informe' }}
            </button>
        </form>
    </div>
</template>

<script setup>
</script>

<style scoped>
</style>