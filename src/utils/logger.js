
import winston from "winston";

const customOptionsLevels = {
    levels: {
        fatal: 1,
        error: 2,
        warn: 3,
        info: 4,
        http: 5,
        debug: 6,
    },
};
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
                winston.format.colorize({ 
                    colors: {
                        debug: 'white',
                        http: 'green',
                        info: 'blue',
                        warning: 'yellow',
                        error: 'magenta',
                        fatal: 'red'
                    }
                 }),
                winston.format.simple(),
            ),
        }),
    ],
});

export default logger