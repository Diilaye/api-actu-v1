const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const {DateTime} = require('luxon');


const Emission = new Schema({

    type: {
        type: String,
        enum: ["invite", "suivre"],
        default: "suivre"
    },

    titre: {
        type: String,
        require: true,
    },

    slug: {
        type: String,
        require: true,
    },

    urlMedia: {
        type: String,
        default: ""
    },


    description: {
        type: String,
        default: ""
    },

    heure: {
        type: String,
        default: "18h00"
    },

    keyWorod: [{
        type: Schema.Types.ObjectId,
        ref: "key-worlds",
        default: []
    }],

    photoCouverture: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "user-admin",
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

module.exports = mongoose.model('emissions', Emission);