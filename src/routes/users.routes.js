import { Router } from "express";
import { userModel } from "../models/user.models.js";

const routerUser = Router();


routerUser.get('/register', async (req, res) => {
    res.render('register');
})

routerUser.post('/register', async (req, res) => { 
    const {first_name, last_name, email, password, age } = req.body;

    try{
        const resultado = await userModel.create({first_name, last_name, email, password, age});
            if(resultado){
                req.session.login = true;
                res.cookie('userSession', resultado._id, { signed: true});
                res.redirect('/api/users/login');
            }else{
                res.status(400).send('No se pudo crear el usuario');
            }
    }catch(error){
        res.status(400).send({error: `El usuario no se pudo crear ${error}`});
    }
})


routerUser.get('/login', async (req, res) => {
    res.render('login');
})

routerUser.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await userModel.findOne({ email }).exec();

        if(user && password === user.password){
            req.session.login = true;
            req.session.user = user;
            res.cookie('userSession', user._id, { signed: true });
            
            res.redirect('/api/index');
        }else{
            return res.render('login', {error: 'Usuario o contraseña incorrecto'});
        }    
    }catch(error){
        res.status(400).send({ error: `Error al iniciar sesión ${error}`})
    }
})

routerUser.get('/logout', async (req, res) =>{
    if(req.session.login){
        req.session.destroy();
    }
    res.status(200).send({ resultado: 'OK', message: 'Ha finalizado la sessión'});
})

routerUser.get('/profile', async (req, res) =>{
    res.render('profile', {user: req.session.user});
})

export default routerUser;