import ticketModel from "../models/tickets.models.js";
import logger from "../utils/logger.js"
import { v4 as uuidv4 } from 'uuid';

export const createTickets = async ( req, res ) =>{
    const {amount, email} = req.query;
        try{
            if(amount <= 0){
                res.status(400).send({error: 'No se pudo generar el ticket, el monto debe ser mayor a 0'});
            }
            if(!email){
                res.status(400).send({error: 'No se pudo generar el ticket, debe ingresar un email'});
            }
            code = uuidv4();
            const ticket = await ticketModel.create({
                code,
                amount,
                purchaser: email,
            });
                res.status(200).send({ message: "El ticket se generó correctamente", ticket});
        }catch(error){
            logger.error(`Error al generar ticket: ${error}`);
            res.status(500).send({ error: `Error al crear el ticket ${error}`});
        }
}

export const getTickets = async (req, res ) => {
    try{
        const ticket = await ticketModel.find({});
        ticket ? res.status(200).send({resultado : 'ok', message: ticket}) : res.status(404).send({error: 'No se pudo encontrar el ticket'});
    }catch(error){
        logger.error(`Error al traer tickets: ${error}`);
        res.status(500).send({error: `Error al traer los tickets ${error}`});
    }
}

