<template>
    <div class="reports-container">
        <h1>Create New Report</h1>

        <form @submit.prevent="submitReport" class="report-form" enctype="multipart/form-data">
            <div class="form-group">
                <label for="report">Report Description</label>
                <textarea id="report" v-model="reportData.report" required placeholder="Describe the incident..."
                    class="form-control text-gray-900"></textarea>
            </div>

            <div class="form-group text-gray-900">
                <label for="room_id">Room ID</label>
                <input type="number" id="room_id" v-model.number="reportData.room_id" required class="form-control" />
            </div>

            <!-- Nuevo campo para subir imágenes -->
            <div class="form-group">
                <label for="upload-image">Upload Image</label>
                <input type="file" id="upload-image" @change="handleFileUpload" class="form-control text-gray-900" />
            </div>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
            </button>
        </form>

        <!-- Success/Error Messages -->
        <div v-if="message" :class="['message', message.type]">
            {{ message.text }}
        </div>
    </div>
</template>

<script>
import { createReport } from '@/services/communicationsScripts/incidentsManager';

export default {
    name: 'Reports',
    data() {
        return {
            reportData: {
                report: '',
                room_id: null,
                image: '',
            },
            imageFile: null,
            isSubmitting: false,
            message: null
        };
    },
    methods: {
        handleFileUpload(event) {
            // Manejar la selección del archivo
            this.imageFile = event.target.files[0];
        },
        async submitReport() {
            this.isSubmitting = true;
            this.message = null;

            try {
                const formData = new FormData();

                // Create a single object with all the report data
                const reportData = {
                    user_id: 1,
                    report: this.reportData.report,
                    room_id: this.reportData.room_id
                };

                console.log('Report Data Object:', reportData);


                formData.append('data', JSON.stringify(reportData));

                if (this.imageFile) {
                    formData.append('image', this.imageFile);
                }

                const response = await createReport(formData);
                console.log('Server Response:', response);

                this.message = {
                    type: 'success',
                    text: 'Report submitted successfully!'
                };

                this.reportData = {
                    report: '',
                    room_id: null,
                    image: '',
                };
                this.imageFile = null;
            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                this.message = {
                    type: 'error',
                    text: 'Error submitting report: ' + error.message
                };
                console.error('Error submitting report:', error);
            } finally {
                this.isSubmitting = false;
            }
        }
    }
};
</script>

<style scoped>
.reports-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #333;
    margin-bottom: 30px;
    text-align: center;
}

.report-form {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

textarea.form-control {
    min-height: 150px;
    resize: vertical;
}

select.form-control {
    cursor: pointer;
}

.submit-btn {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background-color: #45a049;
}

.submit-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.message {
    margin-top: 20px;
    padding: 10px;
    border-radius: 4px;
    text-align: center;
}

.message.success {
    background-color: #dff0d8;
    color: #3c763d;
    border: 1px solid #d6e9c6;
}

.message.error {
    background-color: #f2dede;
    color: #a94442;
    border: 1px solid #ebccd1;
}
</style>