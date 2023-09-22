import { Router } from "express";
import { userModel } from "../models/user.models.js";

const routerSessions = Router();

routerSessions.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        if(req.session.login){
            res.status(200).send({resultado: 'OK', message: 'Usuario ya logueado'});
            const user = userModel.findOne({ email: email});
                if(user){
                    if(user.password == password){
                        req.session.login = true;
                        res.status(200).send({ resultado: 'OK', message: `usuario ${user} logueado`});
                        //aqui puede ir la redireccion
                    }else{
                        res.status(401).send({ resultado: 'Unauthorized', message: 'Identificate para ingresar'});
                    }
                }else{
                    res.status(404).send({ resultado: 'Not Found', message: user })
                }
        }
    }catch(error){
        res.status(400).send({error: `Error al loguearse ${error}`});
    }
})

routerSessions.get('/logout', async (req, res) => {
    if(req.session.login){
        req.session.destroy();
    }
    res.status(200).send({ resultado: 'login Eliminado'});
})

export default routerSessions