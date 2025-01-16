const mongoose = require('mongoose');

const {DateTime} = require('luxon')

const Schema = mongoose.Schema;

const Tags = new Schema({

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
        default: DateTime.now().setZone('Africa/Dakar')
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

module.exports = mongoose.model('tags', Tags);