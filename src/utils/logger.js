import winston from "winston";

const logger = winston.createLogger({
    levels: {
        debug: 1,
        http: 2,
        info: 3,
        warning: 4,
        error: 5,
        fatal: 6
    },
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.printf(({level, message, timestamp}) => `${level}: ${message}: [${timestamp}]`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'})
    ]
});

winston.addColors({
    debug: "white",
    http: "green",
    info: "blue",
    warning: "Yellog",
    error: "red",
    fatal: "orange"
});

export default logger;