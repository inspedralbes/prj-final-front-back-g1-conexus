<template>
    <div class="dark:bg-gray-800 bg-white p-6 rounded-xl shadow-lg shadow-black/30 my-4">
        <h2 class="text-2xl font-semibold border-b border-gray-600 pb-4 mb-4">{{ $t("formAvailability.title") }}</h2>
        <form class="border-b border-gray-600 pb-4 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="availabilityRange" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t("formAvailability.rangeLabel") }}</label>
                    <div>
                        <label for="monday">{{ $t("formAvailability.monday") }}</label>
                        <input type="checkbox" id="monday" name="monday" v-model="availability.monday.available"/>
                        <double-range-slider
                        :min="availability.monday.start"
                        :max="availability.monday.end"
                        :min-threshold="0"
                        :max-threshold="24"
                        @update:min="value => availability.monday.start = +value"
                        @update:max="value => availability.monday.end = +value"
                        ></double-range-slider>
                        <p>{{ $t("formAvailability.from") }}: {{ availability.monday.start }}</p>
                        <p>{{ $t("formAvailability.to") }}: {{ availability.monday.end }}</p>
                    </div>
                    <div>
                        <label for="tuesday">{{ $t("formAvailability.tuesday") }}</label>
                        <input type="checkbox" id="tuesday" name="tuesday" v-model="availability.tuesday.available"/>
                        <double-range-slider
                        :min="availability.tuesday.start"
                        :max="availability.tuesday.end"
                        :min-threshold="0"
                        :max-threshold="24"
                        @update:min="value => availability.tuesday.start = +value"
                        @update:max="value => availability.tuesday.end = +value"
                        ></double-range-slider>
                        <p>{{ $t("formAvailability.from") }}: {{ availability.tuesday.start }}</p>
                        <p>{{ $t("formAvailability.to") }}: {{ availability.tuesday.end }}</p>
                    </div>
                    <div>
                        <label for="wednesday">{{ $t("formAvailability.wednesday") }}</label>
                        <input type="checkbox" id="wednesday" name="wednesday" v-model="availability.wednesday.available"/>
                        <double-range-slider
                        :min="availability.wednesday.start"
                        :max="availability.wednesday.end"
                        :min-threshold="0"
                        :max-threshold="24"
                        @update:min="value => availability.wednesday.start = +value"
                        @update:max="value => availability.wednesday.end = +value"
                        ></double-range-slider>
                        <p>{{ $t("formAvailability.from") }}: {{ availability.wednesday.start }}</p>
                        <p>{{ $t("formAvailability.to") }}: {{ availability.wednesday.end }}</p>
                    </div>
                    <div>
                        <label for="thursday">{{ $t("formAvailability.thursday") }}</label>
                        <input type="checkbox" id="thursday" name="thursday" v-model="availability.thursday.available"/>
                        <double-range-slider
                        :min="availability.thursday.start"
                        :max="availability.thursday.end"
                        :min-threshold="0"
                        :max-threshold="24"
                        @update:min="value => availability.thursday.start = +value"
                        @update:max="value => availability.thursday.end = +value"
                        ></double-range-slider>
                        <p>{{ $t("formAvailability.from") }}: {{ availability.thursday.start }}</p>
                        <p>{{ $t("formAvailability.to") }}: {{ availability.thursday.end }}</p>
                    </div>
                    <div>
                        <label for="friday">{{ $t("formAvailability.friday") }}</label>
                        <input type="checkbox" id="friday" name="friday" v-model="availability.friday.available"/>
                        <double-range-slider
                        :min="availability.friday.start"
                        :max="availability.friday.end"
                        :min-threshold="0"
                        :max-threshold="24"
                        @update:min="value => availability.friday.start = +value"
                        @update:max="value => availability.friday.end = +value"
                        ></double-range-slider>
                        <p>{{ $t("formAvailability.from") }}: {{ availability.friday.start }}</p>
                        <p>{{ $t("formAvailability.to") }}: {{ availability.friday.end }}</p>
                    </div>
                    <div>
                        <label for="saturday">{{ $t("formAvailability.saturday") }}</label>
                        <input type="checkbox" id="saturday" name="saturday" v-model="availability.saturday.available"/>
                        <double-range-slider
                        :min="availability.saturday.start"
                        :max="availability.saturday.end"
                        :min-threshold="0"
                        :max-threshold="24"
                        @update:min="value => availability.saturday.start = +value"
                        @update:max="value => availability.saturday.end = +value"
                        ></double-range-slider>
                        <p>{{ $t("formAvailability.from") }}: {{ availability.saturday.start }}</p>
                        <p>{{ $t("formAvailability.to") }}: {{ availability.saturday.end }}</p>
                    </div>
                    <div>
                        <label for="sunday">{{ $t("formAvailability.sunday") }}</label>
                        <input type="checkbox" id="sunday" name="sunday" v-model="availability.sunday.available"/>
                        <double-range-slider
                        :min="availability.sunday.start"
                        :max="availability.sunday.end"
                        :min-threshold="0"
                        :max-threshold="24"
                        @update:min="value => availability.sunday.start = +value"
                        @update:max="value => availability.sunday.end = +value"
                        ></double-range-slider>
                        <p>{{ $t("formAvailability.from") }}: {{ availability.sunday.start }}</p>
                        <p>{{ $t("formAvailability.to") }}: {{ availability.sunday.end }}</p>
                    </div>
                    </div>
            </div>
        </form>
        <button @click="saveChanges()" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            {{ $t("formAvailability.save") }}
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAppStore } from "@/stores/index";

const appStore = useAppStore();

var user = ref({});

var availability = reactive({
    monday: {
        available: false,
        start: "",
        end: "",
    },
    tuesday: {
        available: false,
        start: "",
        end: "",
    },
    wednesday: {
        available: false,
        start: "",
        end: "",
    },
    thursday: {
        available: false,
        start: "",
        end: "",
    },
    friday: {
        available: false,
        start: "",
        end: "",
    },
    saturday: {
        available: false,
        start: "",
        end: "",
    },
    sunday: {
        available: false,
        start: "",
        end: "",
    },
});

function saveChanges(){
    let availabilityArray = [];
    if(availability.monday.available){
        availabilityArray.push({day: "Monday", "start": availability.monday.start, "end": availability.monday.end});
    }
    if(availability.tuesday.available){
        availabilityArray.push({day: "Tuesday", "start": availability.tuesday.start, "end": availability.tuesday.end});
    }
    if(availability.wednesday.available){
        availabilityArray.push({day: "Wednesday", "start": availability.wednesday.start, "end": availability.wednesday.end});
    }
    if(availability.thursday.available){
        availabilityArray.push({day: "Thursday", "start": availability.thursday.start, "end": availability.thursday.end});
    }
    if(availability.friday.available){
        availabilityArray.push({day: "Friday", "start": availability.friday.start, "end": availability.friday.end});
    }
    if(availability.saturday.available){
        availabilityArray.push({day: "Saturday", "start": availability.saturday.start, "end": availability.saturday.end});
    }
    if(availability.sunday.available){
        availabilityArray.push({day: "Sunday", "start": availability.sunday.start, "end": availability.sunday.end});
    }
    user.value.availability = availabilityArray;
    appStore.setUser(user.value);
}

onMounted(() => {
    user.value = appStore.getUser();
    console.log("pepepeppee"+user.value)
    if (typeof user.value.tags == "string") {
        try {
            user.value.tags = JSON.parse(user.value.tags);
        } catch (error) {
            console.error("Error al parsear tags:", error);
        }
    }
    user.value.availability.forEach(element => {
        if(element.day == "Monday"){
            availability.monday.available = true;
            availability.monday.start = element.start;
            availability.monday.end = element.end;
        }
        if(element.day == "Tuesday"){
            availability.tuesday.available = true;
            availability.tuesday.start = element.start;
            availability.tuesday.end = element.end;
        }
        if(element.day == "Wednesday"){
            availability.wednesday.available = true;
            availability.wednesday.start = element.start;
            availability.wednesday.end = element.end;
        }
        if(element.day == "Thursday"){
            availability.thursday.available = true;
            availability.thursday.start = element.start;
            availability.thursday.end = element.end;
        }
        if(element.day == "Friday"){
            availability.friday.available = true;
            availability.friday.start = element.start;
            availability.friday.end = element.end;
        }
        if(element.day == "Saturday"){
            availability.saturday.available = true;
            availability.saturday.start = element.start;
            availability.saturday.end = element.end;
        }
        if(element.day == "Sunday"){
            availability.sunday.available = true;
            availability.sunday.start = element.start;
            availability.sunday.end = element.end;
        }
    });
});
</script>