import { Router } from "express";
import  ProductManager  from "../controllers/productManager.js";

const productManager = new ProductManager("./src/models/productos.json");
const routerProduct = Router();


routerProduct.get('/', async (req, res) => {
    const {limit} = req.query;

    const prods = await productManager.getProducts();
    const products = prods.slice(0, limit);
    res.status(200).send(products)
})

routerProduct.get('/:id', async (req, res) =>{
    const {id} = req.params;
    const products = await productManager.getProductsByID(id);

    if(products){
        res.status(200).send(products);
    }else{
        res.status(404).send("Producto no existente")
    }
});

routerProduct.post('/', async (req, res) => {
    const confirmacion = await productManager.addProducts(req.body);

        if(confirmacion){
            res.status(200).send("Producto creado correctamente");
        }else{
            res.status(404).send("Debe llenar todos los campos")
        }
})

routerProduct.put('/:id', async (req, res) => {
    const confirmacion = await productManager.updateProducts(req.params.id, req.body);

        if(confirmacion){
            res.status(200).send("Producto actualizado correctamente");
        }else{
            res.status(404).send("No se pudo actualizar el producto")
        }
})

routerProduct.delete('/:id', async (req, res) => {
    const confirmacion = await productManager.deleteProducts(req.params.id);

        if(confirmacion){
            res.status(200).send("Producto eliminado correctamente");
        }else{
            res.status(404).send("No se pudo eliminar el producto");
        }
})


export default routerProduct;
