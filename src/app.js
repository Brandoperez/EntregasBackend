import 'dotenv/config';
import  Express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

import messageModel from "./models/messages.models.js";
import errorHandlers from './middlewares/errors/errorHandlers.js';
import logger from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'; 
import methodOverride from 'method-override'

import {__dirname} from "./path.js";
import path from 'path';
import router from './routes/app.routes.js'
import initializarPassport from './config/passport.js';


const app = Express();
const PORT = 3000;

const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Documentación eccomerce coderHouse",
            version: "1.0.0",
            description: "Api Eccomerce CoderBackend",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

mongoose.connect(process.env.URL_MONGO)
    .then(() => logger.info("BD conectada"))
    .catch((error) => logger.error("Error en conexión a mongoDB atlas: ", error));


    
//SERVER
const server = app.listen(PORT, () =>{
    logger.info("Servidor funcionando");
});

const io = new Server(server);



//MIDDLEWARES
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'));
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(methodOverride('_method'));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGO,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 * 60
    }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
}));

initializarPassport();
app.use(passport.initialize());
app.use(passport.session());

io.on("connection", (socket) => {
    logger.info("Conexion con socket.io");

    socket.on("nuevoMensaje", async (data) =>{
        const {email, message} = data;
        await messageModel.create({ email, message})

        const mensajesGuardados = await messageModel.find();
        io.emit("mensajes", mensajesGuardados);
        
    }); 

});



app.use("/static", Express.static(path.join(__dirname, "/public")));

app.get("/static", async (req, res) =>{
    const productManager = new ProductManager("./src/models/productos.json");
    const productos = await productManager.getProducts();

    res.render("index", {productos});
})

app.get("/static/realtimeproducts", (req, res) =>{

    res.render('realTimeProducts', {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })
})


app.use('/', router)
app.use(errorHandlers);

