const { model, Schema } = require("mongoose")

const Guild = new Schema({
    _id: {
        required: true,
        type: String
    },
    prefix: {
        required: false,
        type: String,
        default: "~"
    },
    channels: {
        required: false,
        type: Array,
        default: ["617018453663940612"]
    }
}, { versionKey: false })

module.exports = model("Guilds", Guild)