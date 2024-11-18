const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const KeyWorld = new Schema({

    titre: {
        type: String,
        require: true,
        unique: true
    },

    slug: {
        type: String,
        require: true,
        unique: true
    },

    statusOnline: {
        type: String,
        enum: ["on", "off", "del"],
        default: "on"
    },

    date: {
        type: Date,
        default: Date.now()
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

module.exports = mongoose.model('key-worlds', KeyWorld);