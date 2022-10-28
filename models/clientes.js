const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const ClientesSchema = new Schema({
  rut: { type: String, uppercase: true, require: true },
  nombre: {type: String, require: true },
  email: { type: String, lowercase: true, require: true },
  telefono: { type: String, require: true },
  transferencias: {type: [Schema.Types.ObjectId], default: [], ref: 'transferencias' },
  cuentas: {type: [Schema.Types.ObjectId], default: [], ref: 'cuentas' },
  contraseña: {type: String, require: true },
  bloqueado: { type: Boolean, default: false },
  token: {
      type: String,
      default: generarRandom =  () => {
        let rnd = (Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000).toString();
        return rnd;
      }
  },
  avatar: { type: String, default: 'default_avatar.png' }
},   {
  minimize: true,
  optimisticConcurrency: true,
  timestamps: { currentTime: () => Date.now('es-CL', { timeZone: 'America/Santiago' })} 
  });

module.exports = mongoose.model('Clientes', ClientesSchema);