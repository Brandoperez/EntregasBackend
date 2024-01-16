import { userModel } from "../models/user.models.js";
import logger from "../utils/logger.js";
import { createHash, validatePassword } from '../utils/bcrypt.js';
import crypto from "crypto";
import { recoveryEmail, sendAccountDeletion } from "../config/nodemailer.js";
import multer from "multer";
import path from "path";
import cartModel from "../models/carts.models.js";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname } from "path";

const recoveryLinks = {};
const RESET_PASSWORD_URL = "http://localhost:3000/api/users/resetPassword/";

export const passwordRecovery = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      logger.error(`No se pudo encontrar el usuario ${email}`);
      return res.status(400).send({ error: `Usuario no encontrado ${email}` });
    }

    const token = crypto.randomBytes(20).toString("hex");
    recoveryLinks[token] = { email, timestamp: Date.now() };
    logger.info(`Token generado para ${email}: ${token}`);
    console.log("recoveryLinks después de agregar el token:", recoveryLinks);

    const recoveryLink = `${RESET_PASSWORD_URL}${token}`;
    recoveryEmail(email, recoveryLink);
    res.status(200).send({ resultado: "OK", message: "El correo electrónico fué enviado correctamente.",});
  } catch (error) {
    logger.error(`Error al enviar el mail de recuperación: ${error}`);
    res.status(500).send({ error: `Error al enviar el mail de recuperación ${error}` });
  }
};

export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

  try {
    const linkToken = recoveryLinks[token];
      if(!linkToken){
        logger.error(`Token no encontrado ${token}`);
        return res.status(400).send({ error: `Token no encontrado: ${token}` });
      }
        const now = Date.now();
        const tokenTimestamp = linkToken.timestamp;
        const tokenAge = now - tokenTimestamp;

        if (tokenAge > process.env.TOKEN_EXPIRATION_TIME) {
          logger.error(`Token expirado: ${token}`);
          return res.status(400).send({ error: `Token expirado: ${token}` });
      }
        const {email} = linkToken;
        try{
          const user = await userModel.findOne({ email });
          if(!user){
            logger.error(`Usuario no encontrado ${email}`);
            return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
          }

            const isSamePassword = validatePassword(newPassword, user.password);

              if(isSamePassword){
                logger.error(`La nueva contraseña no puede ser igual a la anterior`);
                return res.status(400).send({ error: `La nueva contraseña no puede ser igual a la anterior` });
              }
              user.password = createHash(newPassword);
              await user.save()

              delete recoveryLinks[token];
              logger.info(`Password actualizado correctamente para el usuario ${email}`);
              return res.status(200).send({ resultado: 'OK', message: 'Password actualizado correctamente' });
        }catch(error){
          logger.error(`Error al modificar contraseña: ${error}`);
          return res.status(500).send({ error: `Error al modificar contraseña: ${error}` });
        }
  } catch (error) {
        logger.error(`Error al actualizar password: ${error}`);
        return res.status(500).send({ error: `Error al actualizar password: ${error}` });
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users || users.length === 0) {
      logger.info("No se encontraron usuarios en la base de datos");
      return res.status(404).send([]);
    }

    const filterUserData = users.map(
      ({ email, first_name, last_name, role }) => ({
        email,
        first_name,
        last_name,
        role,
      })
    );
    return res.status(200).send(filterUserData);
  } catch (error) {
    logger.error(`Error al obtener los usuarios ${error}`);
    return res
      .status(500)
      .send({ error: `Error al obtener los usuarios ${error}` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      logger.error(`Usuario no encontrado ${id}`);
      return res.status(400).send({ error: `Usuario no encontrado ${id}` });
    }

    await userModel.findByIdAndDelete(id);
    logger.info(`Usuario ${id} eliminado correctamente`);
    return res
      .status(200)
      .send({ respuesta: "OK", message: "Usuario eliminado correctamente" });
  } catch (error) {
    logger.error(`Error al eliminar el usuario ${error}`);
    return res
      .status(500)
      .send({ error: `Error al eliminar el usuario ${error}` });
  }
};

export const deleteUserInactive = async (req, res) => {
  try {
    const users = await findInactiveUsers();
    if (users.length === 0) {
      logger.warning(`No se encontraron usuarios activos`);
      return res
        .status(400)
        .send({ error: `No se encontraron usuarios activos` });
    }

    await processInactiveUser(users);

    logger.info(`Usuarios inactivos eliminados correctamente ${users.length}`);
    return res
      .status(200)
      .send({
        resultado: "OK",
        message: "Usuarios inactivos eliminados correctamente",
      });
  } catch (error) {
    logger.error(`Error al eliminar usuarios inactivos ${error}`);
    return res
      .status(500)
      .send({ error: `Error al eliminar usuarios inactivos ${error}` });
  }
};

const findInactiveUsers = async () => {
  return await userModel.find({
    last_connection: {
      $lt: new Date(Date.now() - process.env.TIME_USER_INACTIVE),
    },
  });
};

const processInactiveUser = async (users) => {
  await Promise.all(
    users.map(async (user) => {
      const { _id, email, cart } = user;
      try {
        await sendAccountDeletion(email);
        await userModel.findByIdAndDelete(_id);
        await cartModel.findByIdAndDelete(cart);
      } catch (error) {
        throw new Error(`Error al procesar usuario: ${error.message}`);
      }
    })
  );
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = determineFolder(file.fieldname);
    cb(null, path.join(__dirname, "..", "public", folder));
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });

const determineFolder = (fieldName) => {
  if (fieldName === "profile") {
    return "documents/profiles";
  } else if (fieldName === "productsImg") {
    return "documents/productsImg";
  } else if (fieldName === "tickets") {
    return "documents/tickets";
  } else {
    return "documents";
  }
};
import { isValidObjectId } from 'mongoose';

export const uploadDocuments = async (req, res) => {
  const { uid } = req.params;
  if (!isValidObjectId(uid)) {
    return res.status(400).send({ message: 'ID de usuario no válido' });
  }

  try {
    const cargarDocumentos = req.files["documents"];
    if (!cargarDocumentos || cargarDocumentos.length === 0) {
      logger.error("No se han enviado archivos correctamente.");
      return res.status(400).send({ message: "No se han enviado archivos correctamente." });
    }

    const user = await userModel.findById(uid);
    if (!user) {
      logger.error(`Usuario no encontrado: ${uid}`);
      return res.status(400).send({ error: `Usuario no encontrado: ${uid}` });
    }

    user.documents = [];
    cargarDocumentos.forEach((file) => {
        user.documents.push(file.filename);
    });

    await user.save();
    logger.info(`Documentos actualizados correctamente para el usuario ${uid}`);
    return res
      .status(200).send({resultado: "OK", message: "Documentos actualizados correctamente",});
  } catch (error) {
    logger.error(` Error al cargar los documentos `);
    res
      .status(500)
      .send({ message: `Error al cargar los documentos ${error}` });
  }
};
