import { generateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { userModel } from "../models/user.models.js";

export const register = async (req, res) => {

    try{
        if(!req.user){
            res.status(401).send({ error: `Error al registrar usuario` });
        }
        
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        }
        res.status(200).send({ payload: req.user })
    }catch(error){
        logger.error(`Error al registrar usuario: ${error}`);
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
    }
}

export const login = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ error: "Usuario invalido" });
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };

    const token = generateToken(req.user);
    res.cookie("jwtCookie", token, {
      maxAge: 43200000
    });
    await userModel.findByIdAndUpdate(req.user._id, {
      last_connection: Date.now(),
    });
    res.redirect('/productos');
    //res.status(200).send({ payload: req.user });
  } catch (error) {
    logger.error(`Error al iniciar sessión ${error}`);
    res.status(500).send({ error: `Error al iniciar sessión ${error}` });
  }
};

export const logout = async (req, res) => {
  if (req.session.user) {
    try {
      await userModel.findByIdAndUpdate(req.session._id, {
        last_connection: Date.now(),
      });
      req.session.destroy();
      res.clearCookie("jwtCookie");
      res.status(200).send({ resultado: "OK", message: "Ha finalizado la sessión" });
    } catch (error) {
      res.status(400).send({ error: `Error al cerrar la sessión ${error}` });
    }
  } else {
    res.status(400).send({ error: "No hay sessión iniciada" });
  }
};

export const github = async (req, res) => {
  res.status(200).send({ message: "Usuario creado con github" });
};

export const githubSession = async (req, res) => {
  (req.session.user = req.user),
    res.status(200).send({ message: "Sessión creada" });
};

export const currentJWTUser = async (req, res) => {
  res.status(200).send({ mensaje: req.user });
};
