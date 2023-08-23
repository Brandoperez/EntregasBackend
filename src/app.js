import  Express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./controllers/productManager.js";
import routerProduct from "./routes/products.routes.js";
import routerCard from "./routes/card.routes.js";
import {__dirname} from "./path.js";
import path from 'path';

const app = Express();
const PORT = 4000;

const productManager = new ProductManager("./src/models/productos.json");

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

// const mensaje = [];

io.on("connection", (socket) => {
    console.log("Conexion con socket.io")

    socket.on("load", async() =>{
        const products = await productManager.getProducts();
        socket.emit("products", products);
    }); 

    socket.on('nuevoProducto', async (prod) => {
        await productManager.addProducts(prod)
        const products = await productManager.getProducts()
        socket.emit("products", products); 
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
app.use('/api/card', routerCard);
