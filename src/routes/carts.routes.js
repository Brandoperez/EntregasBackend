import { Router } from "express";
import { createCart, addProductToCart, getCartById, deleteProductFromCart, deleteCart, updateProductToCart, updateCart } from "../controllers/carts.controller.js";


const routerCart = Router();

routerCart.post('/', createCart);
routerCart.get('/:cid', getCartById);
routerCart.post('/:cid/product/:pid', addProductToCart)
routerCart.put('/:cid', updateCart)
routerCart.put('/:cid/products/:pid', updateProductToCart);
routerCart.delete('/:cid/products/:pid', deleteProductFromCart);
routerCart.delete('/:cid', deleteCart );



export default routerCart;