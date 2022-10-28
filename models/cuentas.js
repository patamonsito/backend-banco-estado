const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cuentasSchema = new Schema({
    tipo: { type: String, default: 'Cuenta Corriente' },
    banco: { type: String, require: true },
    numero: { type: Number, default: generarRandom =  () => {
          let rnd = Math.floor(Math.random() * (9999999999999999 - 1000000000000000 + 1)) + 1000000000000000;
          return rnd;
        }
    },
    saldo: { type: Number, default: 0 }
    },   {
    minimize: true,
    optimisticConcurrency: true,
    timestamps: { currentTime: () => Date.now('es-CL', { timeZone: 'America/Santiago' })} 
  });

module.exports = mongoose.model('cuentas', cuentasSchema);