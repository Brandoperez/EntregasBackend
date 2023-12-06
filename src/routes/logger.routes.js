import { Router } from "express";
import logger from "../utils/logger.js";

const routerLogger = Router();

routerLogger.get('/', (req, res) => {
    logger.debug('Mensaje de prueba - Debug');
    logger.http('Mensaje de prueba - Http');
    logger.info('Mensaje de prueba - Info');
    logger.warning('Mensaje de prueba - Warn');
    logger.error('Mensaje de prueba - Error');
    logger.fatal('Mensaje de prueba - Fatal')
    res.send("OK: Loggers successfully loaded");
})

export default routerLogger