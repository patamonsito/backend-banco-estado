const clientes = require("../models/clientes");
const cuentas = require("../models/cuentas");
const transferencias = require("../models/transferencias");
const destinatarios = require("../models/destinatarios");
const bcrypt = require('bcrypt');

module.exports = class API {
    //get
    static async GET_DESTINATARIOS(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }

            const { id } = req.params;

            const listaDestinatarios = await destinatarios.find({ clienteRef: id }).populate('cuentas');

            return res.status(200).send(listaDestinatarios)

        } catch (err) {
            return res.status(200).json({ message: err.message });

        }

    }

    //post
    static async POST_CREAR_CLIENTE(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            const { contraseña } = req.body;

            const salt = await bcrypt.genSalt(10);

            const passhash = await bcrypt.hash(contraseña, salt)

            req.body.contraseña = passhash;

            const cliente = await new usuarios(req.body).save();

            const id = cliente._id;

            const crearCuenta = await new cuentas({}).save();

            const cuentaId = [crearCuenta._id]

            await usuarios.updateOne({ _id: id }, { $set: { cuentas: cuentaId } })

            return res.status(200).json({ message: 'Usuario Creado con Exito!' });

        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    static async POST_LOGIN(req, res) {
        try {
            const { rut, contraseña } = req.body;

            const cliente = await clientes.findOne({ rut });

            if (!cliente) {
                return res.status(200).json({
                    isValid: false,
                    mensaje: 'el RUT o contraseña inválido'
                });
            } else {
                if (cliente.bloqueado == true) {
                    return res.status(200).send('Cuenta Bloqueada.')
                }
                bcrypt.compare(contraseña, cliente.contraseña, async function (err, result) {
                    if (result == true) {
                        return res.status(200).json({
                            isValid: true,
                            token: cliente.token
                        })
                    } else {
                        return res.status(200).json({
                            isValid: false,
                            mensaje: 'Contraseña Incorrecta'
                        });
                    }
                })
            }
        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    static async POST_TOKEN(req, res) {
        try {
            var { token } = req.body;

            await clientes.
                findOne({ token }).
                lean().
                populate({
                    path: 'transferencias',
                    model: transferencias,
                    options: {
                        sort: {
                            _id: -1
                        }
                    }
                }).
                populate({ path: 'cuentas', model: cuentas }).
                sort({ _id: -1 }).
                exec(async function (err, cliente) {
                    if (cliente) {
                        return res.status(200).send(cliente)
                    } else {
                        return res.status(200).send('Usuario no encontrado.');
                    }
                });

        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    static async POST_CREAR_CUENTA(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            const { id } = req.body;
            const crearCuenta = await new cuentas({}).save();
            const cliente = await clientes.findOne({ _id: id })
            const cuentasCliente = cliente.cuentas.slice();
            cuentasCliente.push(crearCuenta._id)
            await clientes.updateOne({ _id: id }, { $set: { cuentas: cuentasCliente } })

            return res.status(201).json({ message: 'Cuenta creada con Exito!' });

        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    static async POST_REALIZAR_TRANSFERENCIA(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            const { id, cuenta, monto } = req.body;

            const crearTransferencia = await new transferencias(req.body).save();
            const cliente = await clientes.findOne({ _id: id })
            const transferenciasCliente = cliente.transferencias.slice();
            transferenciasCliente.push(crearTransferencia._id);
            await clientes.updateOne({ _id: id }, { $set: { transferencias: transferenciasCliente } })
            const cuentaCliente = await cuentas.findOne({ _id: cuenta });
            const nuevoSaldo = cuentaCliente.saldo - monto;
            if(nuevoSaldo < 100000){
                nuevoSaldo = 1000000
            }
            await cuentas.updateOne({ id: cuenta }, { $set: { saldo: nuevoSaldo } });

            return res.status(201).json({ message: 'transferencia realizada con Exito!' });

        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    static async POST_CREAR_CUENTA_DESTINATARIO(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            let { rut } = req.body;
            let destinatario = await destinatarios.findOne({ rut: rut })
            if (destinatario) {
                const nuevaCuenta = await new cuentas(req.body).save();
                const cuentasDestinatario = destinatario.cuentas.slice();
                cuentasDestinatario.push(nuevaCuenta._id)
                await destinatarios.updateOne({ _id: id }, { $set: { cuentas: cuentasDestinatario } })

                return res.status(201).json({ message: 'Cuenta creada con Exito!' });
            } else {
                const crearCuenta = await new cuentas(req.body).save();
                const crearDestinatario = await new destinatarios(req.body).save();
                const destinatarioId = crearDestinatario._id;
                const cuentaId = crearCuenta._id;
                await destinatarios.updateOne({ _id: destinatarioId }, { $set: { cuentas: cuentaId } })

                return res.status(201).json({ message: 'Cuenta y destinatario agregados Exito!' });
            }

        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    //put
    static async PUT_UPDATE_CLIENTE(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            var { id } = req.params;
            const newDatos = req.body;
            newDatos.Avatar = new_image;
            await clientes.updateOne({ _id: id }, newDatos);
            return res.status(201).json({ message: 'Exito' });
        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    static async PUT_UPDATE_DESTINATARIO(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            let { id } = req.body;
            await destinatarios.updateOne({ _id: id }, { $set: req.body });
            res.status(200).send('destinatario actualizado con Exito!.');
        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    //delete
    static async DELETE_CLIENTE(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            var { id } = req.params;
            await clientes.deleteOne({ _id: id });
            return res.status(200).json({ menssage: 'Cliente Eliminado' })
        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    static async DELETE_DESTINATARIO(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            let { id } = req.body;
            let destinatario = await destinatarios.findOne({ _id: id });
            let cuentasDestinatario = destinatario.cuentas.slice();

            for (let i = 0; i < cuentasDestinatario.length; i++) {
                await cuentas.deleteOne({ _id: cuentasDestinatario[i] })
            }

            await destinatarios.deleteOne({ _id: id });
            res.status(200).send('destinatario eliminado.')

        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    //lock
    static async LOCK_CLIENTE(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            var { id } = req.params;
            await clientes.updateOne({ _id: id }, { $set: { Bloqueado: true } });
            return res.status(200).json({ menssage: 'Cuenta Bloqueada.' })
        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

    //unlock
    static async UNLOCK_CLIENTE(req, res) {
        try {
            if(req.headers.authorization != "Bearer 4329616538"){
                return res.status(200).send('No Autorizado')
            }
            var { id } = req.params;
            await clientes.updateOne({ _id: id }, { $set: { bloqueado: false } });
            return res.status(200).json({ menssage: 'Cuenta Desbloqueada.' })
        } catch (err) {
            return res.status(200).json({ message: err.message });
        }
    }

}
