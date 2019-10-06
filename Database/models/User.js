const { model, Schema } = require("mongoose")

const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    afk: {
        type: Boolean,
        default: false,
        required: false
    },
    afkArgs: {
        type: String,
        required: false
    },
    warn: {
        type: Number,
        default: 0,
        required: false
    },
    money: {
        type: Number,
        default: 0,
        required: false
    }
}, { versionKey: false });

module.exports = model("users", userSchema)