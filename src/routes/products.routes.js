import { Router } from "express";
import { getProducts, getProductsById, addProducts, updateProducts, deleteProducts } from "../controllers/products.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";

const routerProduct = Router();


routerProduct.get('/', getProducts);
routerProduct.get('/:id', getProductsById);
routerProduct.post('/', passportError('jwt'), authorization('admin'), addProducts);
routerProduct.put('/:id', passportError('jwt'), authorization('admin'), updateProducts);
routerProduct.delete('/:id', passportError('jwt'), authorization('admin'), deleteProducts);

export default routerProduct;
