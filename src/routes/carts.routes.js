import { Router } from "express";
import  cartsModel from '../models/carts.models.js'


const routerCart = Router();

routerCart.get('/:cid', async (req, res) =>{
    const { cid } = req.params;
    try{
        const prods = await cartsModel.findById(cid);
        res.status(200).send({ respuesta: 'OK', message: prods});
    }catch(error){
        res.status(400).send({ error: `Error al encontrar el id del carrito ${error}`})
    }
})

routerCart.post('/:cid/product/:pid', async (req, res) =>{
    const {cid, pid} = req.params;
    try{
        const cartId = cid;
        const cart = await cartsModel.findById(cartId)
            if(cart){
                const productoExistente = cart.products.find(product => product.product === pid);
                    if(productoExistente){
                        productoExistente.quantity++
                        }else{
                            cart.products.push({ product: pid, quantity: 1})
                        }

            res.status(200).send({ respuesta: 'OK', message: cart})
            }else{
            res.status(404).send({ respuesta: 'Not found', message: 'No se pudo encontrar la tarjeta'});
            }
    }catch(error){
        res.status(400).send({ error: `Error al cargar la tarjeta: ${error}`});
    }
})



export default routerCart;