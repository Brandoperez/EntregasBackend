import 'dotenv/config';
import Jwt  from 'jsonwebtoken';

export const generateToken = (user) =>{
    const token = Jwt.sign({ user}, process.env.JWT_SECRET, { expiresIn: '12h'});
    return token
}

console.log(generateToken({ "_id": "650cc75f82d8d6a40adf8ba4", "first_name": "Panchito", "last_name": "Perez", "email": "perez@perez.com", "password": "$2b$15$ycmPZjoPYwD5Pb2hpId4PO6PjnWO7R5iMM8X2Vcxw9kMMbMVtWEIe", "rol": "user", "age": { "$numberInt": "40" } }))

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