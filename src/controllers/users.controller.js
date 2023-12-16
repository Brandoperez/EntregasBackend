import { userModel } from "../models/user.models.js";
import logger from "../utils/logger.js";
import crypto from "crypto";
import bcrypt from 'bcrypt';
import recoveryEmail from "../config/nodemailer.js";

export const viewRegister = async (req, res) => {
    res.render('register');
}

export const register = async (req, res ) => {
    try{
        const existingUSer = await userModel.findOne({ email: req.body.email });
        if(existingUSer){
            return res.status(400).send({ mensaje: 'Usuario ya existente'});
        }else{
            return res.status(200).send({ mensaje: 'Usuario creado'});
        }
    }catch(error){
        logger.error(`Error al crear usuario`);
        res.status(500).send({mensaje: `El usuario no se pudo crear ${error}`});
    } 
}

const recoveryLinks = [];
const RESET_PASSWORD_URL = 'http://localhost:4000/api/users/reset-password/';
const generateToken = () => crypto.randomBytes(20).toString('hex');
const storeRecoveryToken = (token, email) => {
    recoveryLinks[token] = {email, timestamp: Date.now()}
};

export const passwordRecovery = async (req, res) =>{
    const {email} = req.body;

    try{
        const user = await userModel.findOne({email});
        if(!user){
            logger.error(`No se pudo encontrar el usuario ${email}`);
            return res.status(400).send({error: `Usuario no encontrado ${email}`});
        }

        const token = generateToken();
        storeRecoveryToken(token, email);

        let recoveryLink = `${RESET_PASSWORD_URL}${token}`;
        recoveryEmail(email, recoveryLink);
            res.status(200).send({ resultado: 'OK', message: "El correo electrónico fué enviado correctamente." })
    }catch(error){
        logger.error(`Error al enviar el mail de recuperación: ${error}`);
        res.status(500).send({error: `Error al enviar el mail de recuperación ${error}`})
    }
}

export const resetPassword = async (req, res) =>{
    try{
        const user = await userModel.findOne({
            passwordResetToken : req.params.token,
            passwordResetExpired : { $gt: Date.now()}
        });
            if(!user){
                logger.error('No se puso reestablecer la contraseña, token invalido o expirado.');
                return res.status(400).send({ error: 'Token inavlido o expirado'});
            }

            const newPassword = req.body.password;
            const oldPassword = await bcrypt.compare(newPassword, user.password);

            if(oldPassword){
                return res.status(400).send('Ingresa una contraseña diferente');
            }

            user.password = await bcrypt.hash(newPassword, 12);
            user.passwordResetToken = undefined;
            user.passwordResetExpired = undefined;
            await user.save();
                res.status(200).send({ resultado: 'ok', message: 'Contraseña restablecida correctamente'});
    }catch(error){
        logger.error(`Error al resetear la contraseña`);
        next(error);
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
        logger.error(`Error al iniciar sessión`);
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