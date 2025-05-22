import mongoose from 'mongoose';

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
        type: [Number],
        default: []
    }
}, {
    timestamps: true,
    collection: 'messages'
});

const Message = mongoose.model("Message", messageSchema);

export default Message; 