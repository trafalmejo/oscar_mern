const mongoose = require('mongoose')
const oscarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const OscarFile = mongoose.model('OscarFile', oscarSchema);
module.exports = OscarFile;