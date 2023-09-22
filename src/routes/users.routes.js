import { Router } from "express";
import { userModel } from "../models/user.models.js";

const routerUser = Router();

routerUser.get('/registro', async (req, res) => {
    res.render('registro');
})

routerUser.post('/', async (req, res) => { 
    const {first_name, last_name, email, password, age } = req.body;

    try{
        const resultado = await userModel.create({first_name, last_name, email, password, age});
        res.status(200).send({ resultado: 'OK', message: `Usuario creado con éxito ${resultado}`});
    }catch(error){
        res.status(400).send({error: `El usuario no se pudo crear ${error}`});
    }
})

export default routerUser;