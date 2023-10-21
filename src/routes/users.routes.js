import { Router } from "express";
import { userModel } from "../models/user.models.js";
import { generateToken } from "../utils/jwt.js";
import { passportError, authorization } from "../utils/messageErrors.js"
import passport  from "passport";

const routerUser = Router();


routerUser.get('/register', async (req, res) => {
    res.render('register');
})

routerUser.post('/register', passport.authenticate('register'), async (req, res) => { 
    
    try{
        if(!req.user){
            return res.status(400).send({ mensaje: 'Usuario ya existente'});
        }else{
            return res.status(200).send({ mensaje: 'Usuario creado'});
        }
    }catch(error){
        res.status(500).send({mensaje: `El usuario no se pudo crear ${error}`});
    }

   /* const { first_name, last_name, email, password, age } = req.body;

    try{
        const hashedPassword = createHash(password);
        const resultado = await userModel.create({
            first_name,
            last_name,
            email, 
            password: hashedPassword,
            age
        })
            if(resultado){
                req.session.login = true;
                res.cookie('userSession', resultado._id, { signed: true});
                res.redirect('/api/users/login');
            }else{
                res.status(400).send('No se pudo crear el usuario');
            }
    }catch(error){
        res.status(400).send({error: `El usuario no se pudo crear ${error}`});
    }*/
})


routerUser.get('/login', async (req, res) => {
    res.render('login');
})

routerUser.post('/login', passport.authenticate('login'), async (req, res) => {
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

    /*const { email, password } = req.body;

    try{
        const user = await userModel.findOne({ email }).exec();

        if(user && validatePassword(password, user.password)){
            req.session.login = true;
            req.session.user = user;
            res.cookie('userSession', user._id, { signed: true });
            
            res.redirect('/api/index');
        }else{
            return res.render('login', {error: 'Usuario o contraseña incorrecto'});
        }    
    }catch(error){
        res.status(400).send({ error: `Error al iniciar sesión ${error}`})
    }*/
})
routerUser.get('/testJWT', passport.authenticate('jwt', { session: true }), async (req, res) =>{
    res.status(200).send({ mensaje: req.user});
    console.log(req.user.user)
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        age: req.user.user.age,
        email: req.user.user.email
    }
});

routerUser.get('/current', passportError('jwt'), authorization('user'), (req, res) =>{
    res.send(req.user);
})

routerUser.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) =>{
    res.status(200).send({ message: 'Usuario creado con github'});
});

routerUser.get('/githubSession', passport.authenticate('github'), async (req, res) =>{
    req.session.user = req.user,
    res.status(200).send({ message: 'Sessión creada'});
})
routerUser.get('/logout', async (req, res) =>{
    if(req.session){
        req.session.destroy();
    }
    res.clearCookie('jwtCookie');
    res.status(200).send({ resultado: 'OK', message: 'Ha finalizado la sessión'});
})

routerUser.get('/profile', async (req, res) =>{
    res.render('profile', {user: req.session.user});
})

export default routerUser;