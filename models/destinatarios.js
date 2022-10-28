const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const destinatariosSchema = new Schema({
    rut: { type: String, uppercase: true, require: true },
    nombre:{ type: String, require: true },
    cuentas: {type: [Schema.Types.ObjectId], default: [], ref: 'cuentas' },
    email: { type: String, lowercase: true },
    telefono: { type: String },
    clienteRef: { type: Schema.Types.ObjectId, require: true }
},   {
    minimize: true,
    optimisticConcurrency: true,
    timestamps: { currentTime: () => Date.now('es-CL', { timeZone: 'America/Santiago' })} 
  });

module.exports = mongoose.model('destinatarios', destinatariosSchema);