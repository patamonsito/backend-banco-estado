const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transferenciasSchema = new Schema({
    rut: { type: String, uppercase: true, require: true },
    nombre:{ type: String, require: true },
    cuenta: { type: Schema.Types.ObjectId, require: true },
    bancoDestino: { type: String, require: true, require: true },
    tipoCuentaDestino: { type: String, require: true, require: true },
    numeroCuentaDestino: { type: String, require: true, require: true },
    email: { type: String, lowercase: true },
    telefono: { type: String },
    monto: { type: Number, min: 1000, max: 1500000, require: true },
    mensaje: { type: String, lowercase: true, require: true },
    numeroOperacion: {
      type: Number,
      default: generarRandom =  () => {
        let rnd = (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString();
        return rnd;
      }
  },
},   {
    minimize: true,
    optimisticConcurrency: true,
    timestamps: { currentTime: () => Date.now('es-CL', { timeZone: 'America/Santiago' })} 
  });

module.exports = mongoose.model('transferencias', transferenciasSchema);