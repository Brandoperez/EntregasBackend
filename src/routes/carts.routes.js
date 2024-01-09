import { Router } from "express";
import { createCart, getCarts, addProductToCart, getCartById, deleteProductFromCart, deleteCart, updateProductToCart, updateCart, purcharseCart} from "../controllers/carts.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";


const routerCart = Router(); 

routerCart.get('/', passportError('jwt'), getCarts)
routerCart.post('/', passportError('jwt'), authorization(['user','admin']), createCart);
routerCart.get('/:cid', passportError('jwt'), authorization(['user','admin']), getCartById);
routerCart.post('/:cid/products/:pid', passportError('jwt'), authorization(['user','admin']), addProductToCart);
routerCart.put('/:cid', passportError('jwt'), authorization(['user','admin']), updateCart)
routerCart.put('/:cid/products/:pid', passportError('jwt'), authorization(['user','admin']), updateProductToCart);
routerCart.post('/:cid/purchase', purcharseCart);
routerCart.delete('/:cid/products/:pid', passportError('jwt'), authorization(['user','admin']), deleteProductFromCart);
routerCart.delete('/:cid', passportError('jwt'), authorization(['user','admin']), deleteCart );



export default routerCart;