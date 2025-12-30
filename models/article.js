const mongoose = require('mongoose');

const {DateTime} = require('luxon')


const Schema = mongoose.Schema;

const Articles = new Schema({

    titre: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        default: ""
    },

    slug: {
        type: String,
    },

    typeUne: {
        type: String,
        enum: ["top", "une", "rubrique", "none"],
        default: "none"
    },
    statusOnline: {
        type: String,
        enum: ["on", "off", "del"],
        default: "on"
    },
    statut: {
        type: String,
        enum: ["publie", "brouillon", "archive"],
        default: "publie"
    },

    categorie: {
        type: Schema.Types.ObjectId,
        ref: "categories",
    },

    tags: {
        type: Schema.Types.ObjectId,
        ref: "tags",
    },

    keyWorod: [{
        type: String,
        default: []
    }],

    image: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "user-admin",
    },


    date: {
        type: Date,
        default: () => DateTime.now().setZone('Africa/Dakar').toJSDate()
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

module.exports = mongoose.model('article', Articles);