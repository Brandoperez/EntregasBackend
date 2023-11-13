
import winston from "winston";

const customOptionsLevels = {
    levels: {
        debug: 1,
        http: 2,
        info: 3,
        warning: 4,
        error: 5,
        fatal: 6
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellog',
        error: 'magenta',
        fatal: 'red'
    }
}
const logger = winston.createLogger({
    levels : customOptionsLevels.levels,
    transports: [
        new winston.transports.File({filename: './src/logs/errors.log', level: 'error',
        format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
        )
    }),
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customOptionsLevels.colors }),
                winston.format.simple(),
            ),
        }),
    ],
});

export default logger