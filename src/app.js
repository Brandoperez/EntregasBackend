import 'dotenv/config';
import  Express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import ProductManager from "./controllers/productManager.js";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js";
import routerMessages from "./routes/messages.routes.js";
import routerUser from "./routes/users.routes.js";
import routerIndex from "./routes/index.routes.js";
import messageModel from "./models/messages.models.js";

import {__dirname} from "./path.js";
import path from 'path';


const app = Express();
const PORT = 4000;

mongoose.connect(process.env.URL_MONGO)
    .then(() => console.log("BD conectada"))
    .catch((error) => console.log("Error en conexión a mongoDB atlas: ", error));


//SERVER
const server = app.listen(PORT, () =>{
    console.log("Servidor funcionando");
});

const io = new Server(server);


//MIDDLEWARES
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'));
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGO,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 50
    }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
}));


io.on("connection", (socket) => {
    console.log("Conexion con socket.io");

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




app.use('/api/products', routerProduct);
app.use('/api/carts', routerCart);
app.use('/api/messages', routerMessages);
app.use('/api/users', routerUser);
app.use('/api/index', routerIndex);
