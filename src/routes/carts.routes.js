import { Router } from "express";
import  cartsModel from '../models/carts.models.js'


const routerCart = Router();

routerCart.get('/:cid', async (req, res) =>{
    const { cid } = req.params;

    try{
        const cart = await cartsModel.findById(cid).populate('products.product');
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
routerCart.put('/:cid', async (req, res) =>{
    const { cid } = req.params;
    const { products } = req.body;

        try{
            const cart = await cartsModel.findById(cid);
            if(!cart){
                res.status(404).send({ resultado: 'Not found', message: 'Producto no encontrado'});
            }
            cart.products = products;

            await cart.save();
            res.status(200).send({ resultado: 'OK', message: "Producto actualizado correctamente"});
        }catch(error){
            res.status(400).send({ error: `Error al actualizar el producto del carrito`});
        }
})
routerCart.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

        try{
            const cart = await cartsModel.findById(cid);
            if(!cart){
                res.status(404).send({ resultado: 'Not found', message: 'Producto no encontrado'});
            }

            const productoEncontrado = cart.products.find((product) => product.product.toString() === pid);
            if(productoEncontrado){
                productoEncontrado.quantity = quantity;
                await cart.save();
                res.status(200).send({ resultado: 'OK', message: 'La cantidad se actualizo correctamente'});
            }else{
                res.status(404).send({ restultado: 'Not found', message: 'Producto no encontrado'});
            }
        }catch(error){
            res.status(400).send({ error: `Error al actualizar el producto del carrito`});
        }
})



export default routerCart;