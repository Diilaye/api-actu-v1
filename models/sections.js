const mongoose = require('mongoose');

const {DateTime} = require('luxon')


const Schema = mongoose.Schema;

const Sections = new Schema({

    type: {
        type: String,
        default: "1"
    },

    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },

    limit: {
        type: Number,
        default: 10,
    },
    skip: {
        type: Number,
        default: 1,
    },

    nombreArticle: {
        type: Number,
        default: 10,
    },

    isMouvable: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: DateTime.now().setZone('Africa/Dakar')
    },

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

module.exports = mongoose.model('sections', Sections);