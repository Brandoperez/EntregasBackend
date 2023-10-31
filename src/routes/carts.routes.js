import { Router } from "express";
import { createCart, addProductToCart, getCartById, deleteProductFromCart, deleteCart, updateProductToCart, updateCart, purcharseCart} from "../controllers/carts.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";


const routerCart = Router();

routerCart.post('/', createCart);
routerCart.get('/:cid', getCartById);
routerCart.post('/:cid/product/:pid', passportError('jwt'), authorization('user'), addProductToCart);
routerCart.put('/:cid', updateCart)
routerCart.put('/:cid/products/:pid', passportError('jwt'), authorization('user'), updateProductToCart);
routerCart.post('/:cid/purcharse', purcharseCart);
routerCart.delete('/:cid/products/:pid', passportError('jwt'), authorization('user'), deleteProductFromCart);
routerCart.delete('/:cid', passportError('jwt'), authorization('user'), deleteCart );



export default routerCart;