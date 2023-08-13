import  Express, { json }  from "express";
import ProductManager from "./controllers/productManager.js";
import routerProduct from "./routes/products.routes.js";
import routerCard from "./routes/card.routes.js";



const app = Express();
const PORT = 4000;

app.use(Express.json());

app.use('/api/product', routerProduct);
app.use('/api/card', routerCard);




app.listen(PORT, () =>{
    console.log("Servidor funcionando");
});