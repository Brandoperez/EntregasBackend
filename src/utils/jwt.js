import 'dotenv/config';
import Jwt  from 'jsonwebtoken';

export const generateToken = (user) =>{
    const token = Jwt.sign({ user}, process.env.JWT_SECRET, { expiresIn: '12h'});
    return token
}

console.log(generateToken({ "_id": "6531c158b3c040d263bf057d", "first_name": "Mare", "last_name": "liza", "email": "mare@gmail.com", "password": "$2b$15$UtgCDG2WQmvLAaf01uTtm.S9yETcZ2eBhx5DgsFbIiQRmMcvIlDDi", "rol": "user", "age": { "$numberInt": "23" } }))

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