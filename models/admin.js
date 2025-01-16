const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const {DateTime} = require('luxon')


const AdminModels = new Schema({

    service: {
        type: String,
        enum: ["journaliste", "redacteur", "administrateur", "comptable", "infographie", "stagiare", "client"],
        default: "client"
    },

    nom: {
        type: String,
        default: ""
    },

    prenom: {
        type: String,
        default: ""
    },

    telephone: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        default: ""
    },

    photoProfile: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    statusConexion: {
        type: String,
        default: "inactive"
    },

    statusOnline: {
        type: String,
        enum: ["on", "off", "del"],
        default: "on"
    },

    token: {
        type: String,
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
            delete ret.password;
            delete ret.statusConexion;
            delete ret.__v;
        },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('user-admin', AdminModels);