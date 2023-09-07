import  Express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";

import ProductManager from "./controllers/productManager.js";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js";
import routerMessages from "./routes/messages.routes.js";
import messageModel from "./models/messages.models.js";

import {__dirname} from "./path.js";
import path from 'path';


const app = Express();
const PORT = 4000;

mongoose.connect('mongodb+srv://brandoperezinciarte:25818340@coderbackend.gz8arqh.mongodb.net/?retryWrites=true&w=majority')
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
app.set('views', path.resolve(__dirname, './views'))


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

app.use('/api/product', routerProduct);
app.use('/api/cart', routerCart);
app.use('/api/mensaje', routerMessages);