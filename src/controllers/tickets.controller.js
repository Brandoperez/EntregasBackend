import ticketModel from "../models/tickets.models.js";
import { v4 as uuidv4 } from 'uuid';

export const createTickets = async ( req, res ) =>{
    const {amount, email} = req.query;
        try{
            code = uuidv4();
            const ticket = await ticketModel.create({
                code,
                amount,
                purchaser: email,
            });
                res.status(200).send({ message: "El ticket se generó correctamente", ticket});
        }catch(error){
            res.status(500).send({ error: `Error al crear el ticket ${error}`});
        }
}

export const getTickets = async (req, res ) => {
    try{
        const response = await ticketModel.find();
            res.status(200).send({response});
    }catch(error){
        res.status(500).send({error: `Error al traer los tickets ${error}`});
    }
}

/*{
    "title": "Pan Dulce",
    "description": "Pan dulce con betun de obediencia",
    "price": 50,
    "stock": 60,
    "category": "Harinas",
    "code": "pdul123"
}*/