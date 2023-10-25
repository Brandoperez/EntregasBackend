import { Router } from "express";
import { getProducts, getProductsById, addProducts, updateProducts, deleteProducts } from "../controllers/products.controller.js"

const routerProduct = Router();


routerProduct.get('/', getProducts);
routerProduct.get('/:id', getProductsById);
routerProduct.post('/', addProducts);
routerProduct.put('/:id', updateProducts)
routerProduct.delete('/:id', deleteProducts);

export default routerProduct;
