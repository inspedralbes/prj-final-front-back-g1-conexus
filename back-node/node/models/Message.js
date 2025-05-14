import mongoose from 'mongoose';

// Creamos primero un esquema para la interacción
const interactionSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    hasLinks: {
        type: Boolean,
        default: false
    },
    links: {
        type: [String],
        default: []
    },
    linkPreviews: {
        type: [{
            url: String,
            title: String,
            description: String,
            image: String,
            siteName: String
        }],
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Esquema principal del mensaje
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    teachers: {
        type: [Number],
        default: []
    },
    interaction: {
        type: [interactionSchema],
        default: []
    },
    deletedFor: {
        type: [Number], // IDs de usuarios que han eliminado el chat
        default: []
    }
}, {
    timestamps: true, // Añade createdAt y updatedAt
    collection: 'messages' // Fuerza el nombre de la colección
});

// Crear el modelo y exportarlo
const Message = mongoose.model("Message", messageSchema);

export default Message; 