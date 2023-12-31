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

routerMessages.post('/', async (req, res) =>{
    const { email, message} = req.body;

    try{
        const newMessage = await messagesModels.create({email, message});

        await newMessage.save();

        console.log(`Nuevo mensaje recibido - Correo: ${email}, Mensaje: ${message}`);
        res.status(200).send({ respuesta: 'OK', message: 'Mensaje guardado con éxito'})
    }catch(error){
        res.status(400).send({erro: `Error al guardar el mensaje ${error}`});
    }
})



export default routerMessages;