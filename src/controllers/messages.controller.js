import messageModel from '../models/messages.models.js'
import logger from "../utils/logger.js";

export const getMessages = async (req, res) =>{
    try{
        const messages = await messageModel.find();
        return res.status(200).send({resultado: 'OK', messages});
    }catch(error){
        logger.error('Error al consultar mensajes');
        res.status(400).send({error: `Error al consultar todos los mensajes ${error}`});
    }
}

export const postMessage = async (req, res) => {
    const { email, message } = req.body;
        try{
            const newMessage = await messageModel.create({email, message});
            res.status(200).send({resultado: 'OK', newMessage});
        }catch(error){
            res.status(400).send({error: `Error al crear mensajes ${error}`});
        }
}