import  Express, { json }  from "express";
import ProductManager from "./productManager.js";


const ruta = new ProductManager("../path/productos.json");

const app = Express();
const PORT = 4000;

app.get("/", async(req, res) =>{
    res.send("Bienvenidos a nuestra aplicacion");
})

app.get("/productos", async(req, res) =>{
    const {limitProducts} = req.query;
    const products = await ruta.getProducts();
        if(limitProducts){
            const limit = products.slice(0, limitProducts);
            res.json({status: "success", limit})
        }else{
            res.json({status:"success", products})
        }
})

app.get("/productos/:id", async(req, res) =>{
    const {id} = req.params;
    const products = await ruta.getProducts()
    const idNumero = parseInt(id);

        const buscadorID = products.find(prod => prod.id === idNumero);
            if(buscadorID){
                console.log(buscadorID);
                res.send({status: "Success", buscadorID})
            }else{
                console.log("Producto no encontrado");
                res.send({status: "Error", message: "Producto no encontrado"})
            }
            
})

app.listen(PORT, () =>{
    console.log("Servidor funcionando");
});