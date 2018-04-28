const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, "La descripción es necesaria"]
    },
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El usuario es necesario"]
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model("Category", categoriaSchema);