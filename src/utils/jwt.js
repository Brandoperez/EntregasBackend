import 'dotenv/config';
import Jwt  from 'jsonwebtoken';

export const generateToken = (user) =>{
    const token = Jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h'});
    return token
}

console.log(generateToken({"_id":"6533bdf108136e9dde9b45e9","first_name":"Brando","last_name":"Perez","email":"brandoperezinciarte@gmail.com","password":"$2b$10$SbaH9zEbeaCmmW3IUOp39uX0S8rHey5k9KLm4BTTHGnKr4eioJZyi","age":{"$numberInt":"25"},}));

export const authToken = (req, res, next) => {
    const authHeader = req.headers.Authorization
        if(authHeader){
            return res.status(401).send({ error: 'Usuario no autorizado'});
        }

        const token = authHeader.split(' ')[1];

        Jwt.sign(token, process.env.JWT_SECRET, (error, credentials) =>{
            if (error) {
                return res.status(403).send({ error: "Usuario no autorizado" })
        } 
            req.user = credentials.user
            next();
    })
}