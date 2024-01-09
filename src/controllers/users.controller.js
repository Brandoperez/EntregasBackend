import { userModel } from "../models/user.models.js";
import logger from "../utils/logger.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { recoveryEmail, sendAccountDeletion } from "../config/nodemailer.js";
import multer from "multer";
import path from "path";
import cartModel from "../models/carts.models.js";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname } from "path";

const recoveryLinks = {};
const RESET_PASSWORD_URL = "http://localhost:4000/api/users/reset-password/";
const generateToken = () => crypto.randomBytes(20).toString("hex");
const storeRecoveryToken = (token, email) => {
  recoveryLinks[token] = { email, timestamp: Date.now() };
};

export const passwordRecovery = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      logger.error(`No se pudo encontrar el usuario ${email}`);
      return res.status(400).send({ error: `Usuario no encontrado ${email}` });
    }

    const token = generateToken();
    storeRecoveryToken(token, email);
    logger.info(`Token generado para ${email}: ${token}`);

    let recoveryLink = `${RESET_PASSWORD_URL}${token}`;
    recoveryEmail(email, recoveryLink);
    res
      .status(200)
      .send({
        resultado: "OK",
        message: "El correo electrónico fué enviado correctamente.",
      });
  } catch (error) {
    logger.error(`Error al enviar el mail de recuperación: ${error}`);
    res
      .status(500)
      .send({ error: `Error al enviar el mail de recuperación ${error}` });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const user = await userModel.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpired: { $gt: Date.now() },
    });
    if (!user) {
      logger.error(
        `No se puso reestablecer la contraseña, token invalido o expirado. ${error}`
      );
      return res.status(400).send({ error: "Token inavlido o expirado" });
    }

    const newPassword = req.body.password;
    const oldPassword = await bcrypt.compare(newPassword, user.password);

    if (oldPassword) {
      return res
        .status(400)
        .send({
          error: `La contraseña no puede ser igual a la anterior, ingresa una nueva contraseña`,
        });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save();
    res
      .status(200)
      .send({
        resultado: "OK",
        message: "Contraseña restablecida correctamente",
      });
  } catch (error) {
    logger.error(`Error al resetear la contraseña: ${error}`);
    next(error);
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
