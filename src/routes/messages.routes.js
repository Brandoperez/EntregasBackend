import { Router } from "express";
import messagesModels from '../models/messages.models.js'

const routerMessages = Router();


routerMessages.get('/mensajes', async (req, res) =>{
    try{
        const mensajes = await messagesModels.find();
        res.status(200).send({ respuesta: 'Ok', mensajes});
    }catch(error){
        res.status(400).send({ error: `Error al cargar los mensajes ${error}`});
    }
});

routerMessages.post('/mensaje', async (req, res) =>{
    try{
        const { email, message} = req.body;
        const newMessage = messagesModels({email, message});

        await newMessage.save();

        console.log(`Nuevo mensaje recibido - Correo: ${email}, Mensaje: ${message}`);

        req.io.emit('nuevoMensaje', newMessage);
        res.status(200).send({ respuesta: 'OK', message: 'Mensaje guardado con éxito'})
    }catch(error){
        res.status(400).send({erro: `Error al guardar el mensaje ${error}`});
    }
})






export default routerMessages;