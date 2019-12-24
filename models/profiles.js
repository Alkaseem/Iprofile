const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema ({
    fullName: {
        type: String,
        required: true
        },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
    skill1: {
        type: String,
        required: true
    },
    skill2: {
        type: String,
        required: true
    },
    skill3: {
        type: String,
        required: true
    },
    lang1: {
        type: String,
        required: true
    },
    lang2: {
        type: String,
        required: true
    },
    lang3: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    secondrySch: {
        type: String,
        required: true
    },
    date1: {
        type: String,
        required: true
    },
    tertiarySch: {
        type: String,
        required: true
    },
    date2: {
        type: String,
        required: true
    },
    others: {
        type: String,
        required: true
    },
    date3: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now}


});

module.exports = mongoose.model("Profile", profileSchema);