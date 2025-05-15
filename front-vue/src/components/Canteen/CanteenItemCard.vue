<template>
<div class="canteen-item-card">
    <h2>{{ item.product_name }}</h2>
    <h3>Preu: {{ item.product_price }}€</h3>
    <div class="button-group">
        <button v-if="item.product_enabled" @click="disable()" class="btn disable">Deshabilitar</button>
        <button v-if="!item.product_enabled" @click="enable()" class="btn enable">Habilitar</button>
        <button @click="ToggleModal" class="btn edit">Editar</button>
        <button @click="callDeleteItem(item.id)" class="btn delete">Eliminar</button>
    </div>
</div>
<div class="modal" v-if="showModal">
    <div class="modal-content">
        <h3>Editar producte</h3>
        <form @submit.prevent="editProduct">
            <label for="productName">Nom del producte:</label>
            <input type="text" id="productName" v-model="item.product_name" required />
            <label for="productPrice">Preu:</label>
            <input type="number" id="productPrice" v-model="item.product_price" required />
            <button type="submit" class="btn save">Guardar</button>
        </form>
        <button @click="showModal = false" class="btn close">Tancar</button>
    </div>
</div>
</template>
<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/index.js';
import { useRouter } from 'vue-router';
import { deleteItem } from '@/services/communicationsScripts/canteenComManager';
import { ref } from 'vue';
import { updateItem } from '@/services/communicationsScripts/canteenComManager';

const showModal=ref(false);
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});
function callDeleteItem(id) {
    props.callDeleteItem(id);
}
function ToggleModal() {
    showModal.value = !showModal.value;
}
function disable() {
    props.item.product_enabled = false;
    updateItem(props.item)
        .then((response) => {
            console.log('Producte deshabilitat:', response.data);
        })
        .catch((error) => {
            console.error('Error deshabilitant producte:', error);
        });
}
function enable() {
    props.item.product_enabled = true;
    updateItem(props.item)
        .then((response) => {
            console.log('Producte habilitat:', response.data);
        })
        .catch((error) => {
            console.error('Error habilitant producte:', error);
        });
}
function editProduct() {
    updateItem(props.item)
        .then((response) => {
            console.log('Producte editat:', response.data);
        })
        .catch((error) => {
            console.error('Error editant producte:', error);
        });
    showModal.value = false;
}
</script>
<style scoped>
.canteen-item-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    color: black; /* Ensure all text inside is black */
}

.canteen-item-card h2 {
    font-size: 1.5rem;
    margin-bottom: 8px;
    color: black; /* Set text color to black */
}

.canteen-item-card h3 {
    font-size: 1.2rem;
    margin-bottom: 16px;
    color: black; /* Set text color to black */
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
    color: black; /* Ensure button text is black */
}

.btn.disable {
    background-color: #f44336;
    color: white; /* Keep button text white for contrast */
}

.btn.enable {
    background-color: #4caf50;
    color: white; /* Keep button text white for contrast */
}

.btn.edit {
    background-color: #2196f3;
    color: white; /* Keep button text white for contrast */
}

.btn.delete {
    background-color: #ff9800;
    color: white; /* Keep button text white for contrast */
}

.btn:hover {
    opacity: 0.9;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: black; /* Ensure modal text is black */
}

.modal-content h3 {
    margin-bottom: 16px;
    font-size: 1.2rem;
    color: black; /* Set text color to black */
}

.modal-content form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.modal-content input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    color: black; /* Ensure input text is black */
}

.btn.save {
    background-color: #4caf50;
    color: white; /* Keep button text white for contrast */
}

.btn.close {
    background-color: #f44336;
    color: white; /* Keep button text white for contrast */
    margin-top: 16px;
}
</style>
