import { userModel } from "../models/user.models.js";
import { generateToken } from "../utils/jwt.js";

export const viewRegister = async (req, res) => {
    res.render('register');
}

export const register = async (req, res ) => {
    try{
        if(!req.user){
            return res.status(400).send({ mensaje: 'Usuario ya existente'});
        }else{
            return res.status(200).send({ mensaje: 'Usuario creado'});
        }
    }catch(error){
        res.status(500).send({mensaje: `El usuario no se pudo crear ${error}`});
    } 
}

export const viewLogin = async (req, res) => {
    res.render('login');
}

export const login = async (req, res) => {
    try{
        if(!req.user){
            return res.status(401).send({ message: 'Usuario invalido'});
        }

        req.session.user = {
            first_name : req.user.first_name,
            last_name : req.user.last_name,
            age : req.user.age,
            email : req.user.email
        }

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        });

        res.status(200).send({ playload: req.user})
    }catch(error){
        res.status(500).send({message: `Error al iniciar sessión ${error}`});
    }
}

export const github = async (req, res) => {
    res.status(200).send({ message: 'Usuario creado con github'});
}

export const githubSession = async (req, res) => {
    req.session.user = req.user,
    res.status(200).send({ message: 'Sessión creada'});
}

export const logout = async (req, res) => {
    if(req.session){
        req.session.destroy();
    }
    res.clearCookie('jwtCookie');
    res.status(200).send({ resultado: 'OK', message: 'Ha finalizado la sessión'});
}