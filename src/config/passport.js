import local from "passport-local";
import passport from "passport";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt"
import { createHash, validatePassword } from "../utils/bcrypt.js"; 
import { userModel } from "../models/user.models.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt ;


const initializarPassport = () => {

    const cookieExtractor = req => {
        console.log(req.cookies);
        const token = req.cookies ? req.cookies.jwtCookie : {};
        console.log(token);
        return token;
    }
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_playload, done) => {
        try{
            console.log(jwt_playload)
            return done(null, jwt_playload);
        }catch(error){
            return done(error);
        }
    }));


    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            const { first_name, last_name, email, age } = req.body;

                try{
                    const user = await userModel.findOne({ email: email});
                        if(user){
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
                        console.log(resultado);
                        return done(null, resultado);

                }catch(error){
                    return done(error);
                }
        }
    ));


    passport.use('login', new LocalStrategy({ usernameField: 'email'}, async (username, password, done) => {
        try{
            const user = await userModel.findOne({ email: username});

                if(!user){
                    return done(null, false);
                }
                if(validatePassword(password, user.password)){
                    return done(null, user);
                }
        }catch(error){
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) =>{
        try{
             console.log(accessToken),
             console.log(refreshToken),
             console.log(process.env.CALLBACK_URL)

             const user = await userModel.findOne({ email: profile._json.email });
                if(!user){
                    const createUser = await userModel.create({
                        first_name: profile._json.name,
                        last_name: " ",
                        email: profile._json.email,
                        age: 18,
                        password: 'password'
                    }) 
                     done(null, createUser);
                }else{
                    done(null, user);
                }
        }catch(error){
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