import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { register, login, github, githubSession, logout} from "../controllers/sessions.controller.js"

const routerSession = Router();

routerSession.get('/register', (req, res) => {res.render('register');})
routerSession.get('/login', (req, res) => {res.render('login');})

routerSession.post('/register', passport.authenticate('register'), register);
routerSession.post('/login', passport.authenticate('login'), login)
routerSession.get('/github', passport.authenticate('github', {scope: ['user:email']}), github);
routerSession.get('/githubSession', passport.authenticate('github'), githubSession);
routerSession.get('/logout', passport.authenticate('jwt', { session: false }), logout)
routerSession.get('/current', passportError('jwt'), authorization('user'), (req, res) =>{
    res.send(req.user);
})

export default routerSession
