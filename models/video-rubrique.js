const mongoose = require('mongoose');

const {DateTime} = require('luxon')

const Schema = mongoose.Schema;

const VideoRubriqueModel = new Schema({

    titre: {
        type: String,
        required: true,
        default: '',
    },

    emission: {
        type: String,
        required: true,
        default: ''
    },

    url : {
        type: String,
        required: true,
        default: ''
    },

    isLive: {
        type: String,
        enum: ["on", "off"],
        default: "off"
    },

    statusOnline: {
        type: String,
        enum: ["on", "off", "del"],
        default: "on"
    },

    image: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },


    date: {
        type: Date,
        default: () => DateTime.now().setZone('Africa/Dakar')
    }

}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('video-rubrique', VideoRubriqueModel);