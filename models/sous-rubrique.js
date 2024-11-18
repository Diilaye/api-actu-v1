const mongoose = require('mongoose');
const categories = require('./categories');

const Schema = mongoose.Schema;

const SousCategorie = new Schema({

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

    categorie: {
        type: Schema.Types.ObjectId,
        ref: "categories",
    },

    color: {
        type: String,
        default: '000000'
    },

    bgColor: {
        type: String,
        default: 'ffffff'
    },

    photoCouverture: {
        type: Schema.Types.ObjectId,
        ref: "media",
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

module.exports = mongoose.model('sous-categories', SousCategorie);