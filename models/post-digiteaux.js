const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostDigiteaux = new Schema({

    type: {
        type: String,
        enum: ["essentiel", "commercial"],
        default: "essentiel"
    },


    image: {
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

    titre: {
        type: String,
        default: ''
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
            delete ret.password;
            delete ret.statusConexion;
            delete ret.__v;
        },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('posts-digiteaux', PostDigiteaux);