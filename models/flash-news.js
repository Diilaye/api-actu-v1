const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FlashNews = new Schema({

    type: {
        type: String,
        default: ""
    },

    desc: {
        type: String,
        default: ""
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

module.exports = mongoose.model('flash-news', FlashNews);