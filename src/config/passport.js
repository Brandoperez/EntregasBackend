import local from "passport-local";
import passport from "passport";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt"
import { createHash, validatePassword } from "../utils/bcrypt.js"; 
import { userModel } from "../models/user.models.js";
import logger from '../utils/logger.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt ;


const initializarPassport = () => {

    const cookieExtractor = req => {
        logger.info(req.cookies);
        const token = req.cookies ? req.cookies.jwtCookie : {}
        return token;
    }
        const { fromAuthHeaderAsBearerToken } = ExtractJWT;

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, fromAuthHeaderAsBearerToken]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_playload, done) => {
        try{
            const user = await userModel.findById(jwt_playload.user._id);
                if(!user){
                    return(done, false)
                }
                    return done(null, user);
        }catch(error){
            logger.error(error);
            return done(error);
        }
    }));


    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            const { first_name, last_name, email, age } = req.body;

                try{
                    const user = await userModel.findOne({ email: email});
                        if(user){
                            logger.info('Usuario Existente')
                            return done(null, false);
                        }
                        const hashedPassword = createHash(password);
                        const resultado = await userModel.create({
                            first_name,
                            last_name,
                            email, 
                            password: hashedPassword,
                            age
                        })
                        logger.info(resultado);
                        return done(null, resultado);

                }catch(error){
                    logger.error(error)
                    return done(error);
                }
        }
    ));


    passport.use('login', new LocalStrategy({ usernameField: 'email'}, async (username, password, done) => {
        try{
            const user = await userModel.findOne({ email: username});

                if(!user){
                    logger.info('Usuario No encontrado')
                    return done(null, false);
                }
                if(validatePassword(password, user.password)){
                    logger.info('Usuario y contraseña correctos')
                    return done(null, user);
                }
        }catch(error){
            logger.error(error);
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) =>{
        try{
             const user = await userModel.findOne({ email: profile._json.email });
                if(!user){
                    const password = createHash('password')
                    const createUser = await userModel.create({
                        first_name: profile._json.name,
                        last_name: " ",
                        email: profile._json.email,
                        age: 18,
                        password: password
                    }) 
                    logger.info('Usuario creado')
                     done(null, createUser);
                }else{
                    logger.info('Usuario existente')
                    done(null, user);
                }
        }catch(error){
            logger.error(error)
             done(error);
        }
    }));

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) =>{
        const user = await userModel.findById(id)
        done(null, user);
    });

}

export default initializarPassport;