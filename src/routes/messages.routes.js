import { Router } from "express";
import { getMessages, postMessage } from '../controllers/messages.controller.js'
import { passportError, authorization } from "../utils/messageErrors.js";

const routerMessages = Router();


routerMessages.get('/', passportError('jwt'), authorization(['user','admin']), getMessages);
routerMessages.post('/', passportError('jwt'), authorization(['user', 'admin']), postMessage);


export default routerMessages;