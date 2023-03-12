const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const produtos = new Schema({
    nome: {
    type:   String,
    required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        required: true
    }
})

mongoose.model("produtos", produtos)