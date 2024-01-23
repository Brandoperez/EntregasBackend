import { Router } from "express";
import { getProducts, getProductsById, addProducts, updateProducts, vistaUpdate, deleteProducts } from "../controllers/products.controller.js";
import { generateProductsMocking } from "../controllers/mocking.controller.js"
import { passportError, authorization } from "../utils/messageErrors.js";

const routerProduct = Router();

//VISTAS
routerProduct.get('/addProducts', (req, res) => { res.render('products/addProducts');} )
routerProduct.get('/editProducts/:id', vistaUpdate);



routerProduct.get('/', getProducts);
routerProduct.get('/:id', getProductsById);
routerProduct.post('/', passportError('jwt'), authorization('admin'), addProducts);
routerProduct.post('/mockingproducts', passportError('jwt'), authorization('admin'), generateProductsMocking);
routerProduct.put('/:id', passportError('jwt'), authorization('admin'), updateProducts);
routerProduct.delete('/:id', passportError('jwt'), authorization('admin'), deleteProducts);



export default routerProduct;
