import { Router } from "express";
import { github, githubSession, login, logout, register, viewLogin, viewRegister, passwordRecovery, resetPassword, uploadDocuments} from "../controllers/users.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";


import passport  from "passport";

const routerUser = Router();


routerUser.get('/register', viewRegister);
routerUser.post('/register', passport.authenticate('register'), register);
routerUser.post('/passwordRecovery', passwordRecovery);
routerUser.post('/resetPassword/:token', resetPassword);
routerUser.get('/login', viewLogin)
routerUser.post('/login', passport.authenticate('login'), login)
routerUser.get('/github', passport.authenticate('github', {scope: ['user:email']}), github);
routerUser.get('/githubSession', passport.authenticate('github'), githubSession);
routerUser.get('/logout', logout)
routerUser.post('/:uid/documents', upload.array('files'), uploadDocuments);

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





routerUser.get('/profile', async (req, res) =>{
    res.render('profile', {user: req.session.user});
})

export default routerUser;