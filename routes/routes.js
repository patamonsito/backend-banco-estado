const express = require('express');
const router = express.Router();
const API = require('../controllers/api')

//Get
router.get('/destinatarios/:id', API.GET_DESTINATARIOS);

//post
router.post('/auth/cliente', API.POST_LOGIN);
router.post('/auth/token', API.POST_TOKEN);
router.post('/cuentas/crear', API.POST_CREAR_CUENTA);
router.post('/clientes/crear', API.POST_CREAR_CLIENTE);
router.post('/destinatarios/crear', API.POST_CREAR_CUENTA_DESTINATARIO);
router.post('/transferencias/realizar', API.POST_REALIZAR_TRANSFERENCIA);

//update
router.put('/clientes/actualizar', API.PUT_UPDATE_CLIENTE);
router.put('/destinatarios/realizar', API.PUT_UPDATE_DESTINATARIO);

//delete
router.delete('/clientes/eliminar/:id', API.DELETE_CLIENTE);
router.delete('/destinatarios/eliminar/:id', API.DELETE_DESTINATARIO);

//block
router.lock('/clientes/:id', API.LOCK_CLIENTE);

//unblock
router.unlock('/user/:id', API.UNLOCK_CLIENTE);


module.exports = router;