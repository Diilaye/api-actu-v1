const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const LiveFeedModel = new Schema({
    titre: {
        type: String,
        required: true,
    },

    contenu: {
        type: String,
        required: true,
    },

    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
    },

    image: {
        type: Schema.Types.ObjectId,
        ref: 'media',
    },

    type: {
        type: String,
        enum: ['breaking', 'update', 'info', 'urgent'],
        default: 'info'
    },

    priorite: {
        type: Number,
        default: 0, // Plus le nombre est élevé, plus c'est prioritaire
    },

    auteur: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },

    statusOnline: {
        type: String,
        enum: ['on', 'off', 'del'],
        default: 'on'
    },

    article: {
        type: Schema.Types.ObjectId,
        ref: 'articles',
    },

    date: {
        type: Date,
        default: () => DateTime.now().setZone('Africa/Dakar')
    },

    dateModification: {
        type: Date,
        default: () => DateTime.now().setZone('Africa/Dakar')
    }

}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('live_feeds', LiveFeedModel);
