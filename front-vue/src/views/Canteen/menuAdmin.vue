<template>
    <div>
        <h2>Administració de menú</h2>
        <button @click="toggleShowModal()">Crear nou producte</button>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in canteenItems" :key="item.id" class="bg-white rounded-lg shadow-md p-4">
                <CanteenItemCard :item="item" @callDeleteItem="async (id) => { 
                    await deleteItem(id);
                    canteenItems.value = await getAllCanteenItems();
                }" />
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <h3>Crear nou producte</h3>
            <form @submit.prevent="createNewProduct">
                <label for="productName">Nom del producte:</label>
                <input type="text" id="productName" v-model="newProductName" required />
                <label for="productPrice">Preu:</label>
                <input type="number" id="productPrice" v-model.number="newProductPrice" step="0.01" required />
                <button type="submit">Crear</button>
            </form>
            <button @click="toggleShowModal()">Tancar</button>
        </div>
    </div>

</template>
<script setup>
import { onMounted } from 'vue';
import { getAllCanteenItems, createItem, deleteItem } from '@/services/communicationsScripts/canteenComManager';
import { ref } from 'vue';
import CanteenItemCard from '@/components/Canteen/CanteenItemCard.vue';

const canteenItems = ref([]);
const showModal = ref(false);
const newProductName = ref('');
const newProductPrice = ref(0);
const toggleShowModal = () => {
    showModal.value = !showModal.value;
};

function createNewProduct() {
    // Aquí va la lògica per crear un nou producte
    createItem({
        product_name: newProductName.value,
        product_price: newProductPrice.value,
        product_enabled: true
    })
        .then(async (response) => {
            console.log('Producte creat:', response.data);
            canteenItems.value = await getAllCanteenItems();
            newProductName.value = '';
            newProductPrice.value = 0;
        })
        .catch((error) => {
            console.error('Error creating product:', error);
        });
    toggleShowModal();
}
onMounted(async () => {
    let response= await getAllCanteenItems();
    canteenItems.value = response;
    console.log('Canteen items:', canteenItems.value);

});
</script>
<style scoped>
/* Estils específics per al component MenuAdmin */
h2 {
    color: #4a5568;
    /* Color gris fosc */
    font-size: 2rem;
    /* Mida de la lletra */
    font-weight: bold;
    /* Lletra en negreta */
    margin-bottom: 1rem;
    /* Espai inferior */
}

button {
    background-color: #4a5568;
    /* Color gris fosc */
    color: white;
    /* Lletra blanca */
    padding: 0.5rem 1rem;
    /* Espai interior */
    border-radius: 0.375rem;
    /* Arrodoniment */
    border: none;
    /* Sense bordes */
    cursor: pointer;
    /* Cursor de mà */
}

button:hover {
    background-color: #2d3748;
    /* Color gris més fosc */
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
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: black;
}

.card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    background-color: #f9f9f9;
    color: black;
}

.card h3 {
    margin: 0;
    font-size: 1.5em;
}

.card h4 {
    margin: 0;
    font-size: 1.2em;
    color: #666;
}

.card ul {
    list-style-type: none;
    padding: 0;
}

.card button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.card button:hover {
    background-color: #0056b3;
    /* Color blau més fosc */
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
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: black;
}
</style>