import productsModel from '../models/products.models.js';
import cartsModel from '../models/carts.models.js';
import { userModel } from '../models/user.models.js';
import logger from '../utils/logger.js';

export const createCart = async (req, res) => {

    try {
        const respuesta = await cartsModel.create({});
        res.status(200).send({ resultado: "OK", message: respuesta });
      } catch (error) {
        logger.error(`Error al crear el carrito`);
        res.status(500).send({ error: `Error al crear el carrito: ${error}` });
      }
}

export const addProductToCart = async (req, res) =>{

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
        logger.error(`Error al agregar productos al carrito`);
        res.status(500).send({ error: `Error al cargar la tarjeta: ${error}`});
    }
}

export const updateProductToCart = async (req, res) => { 

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
            logger.error(`Error al actualizar el producto del carrito`);
            res.status(500).send({ error: `Error al actualizar el producto del carrito ${error}`});
        }
}

export const updateCart = async (req, res) =>{
    
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
            logger.error(`Error al actualizar el carrito`);
            res.status(500).send({ error: `Error al actualizar el producto del carrito ${error}`});
        }
}
export const getCartById = async (req, res) => {
    
    const { cid } = req.params;
    try{
        const cart = await cartsModel.findById(cid).populate('products.product');
        cart ? res.status(200).send({ respuesta: 'OK', message: prods}) : res.status(404).send({error: 'No se encontró el carrito'});
    }catch(error){
        logger.error(`Error al obtener el carrito`);
        res.status(500).send({ error: `Error al encontrar el id del carrito ${error}`})
    }
}

export const deleteProductFromCart = async (req, res) => {

    const { cid, pid} = req.params;

            try{
                const cart = cartsModel.findById(cid);
                if(!cart){
                    res.status(404).send({ resultado: 'Not found', message: 'Carrito no encontrado'});
                }

                cart.products = cart.products.filter((producto) => producto.producto.toString() !== pid);
                await cart.save();
                res.status(200).send({ resultado: 'OK', message: "Producto eliminado con éxito"});
            }catch(error){
                logger.error(`Error al eliminar el producto del carrito`);
                res.status(500).send({ error: `Error al eliminar el producto del carrito ${error}`})
            }
}

export const deleteCart = async (req, res) =>{

    const {cid} = req.params;
    try{
        const cart = cartsModel.findById(cid);
        if(!cart){
            res.status(404).send({ resultado: 'not found', message: "Carrito no encontrado"});
        }
        cart.products = [];
        await cart.save();

        res.status(200).send({ resultado: 'OK', message: 'Todos los productos han sido eliminados'});
    }catch(error){
        logger.error(`Error al eliminar el carrito`);
        res.status(500).send({error: `Error al eliminar todos los productos ${error}`});
    }
}

export const purcharseCart = async (req, res) => {

    const { cid } = req.params;
        try{
            const cart = await cartsModel.findById(cid);
            const products = await productsModel.find();

                if(cart){
                    const user = await userModel.findOne({ cart: cart._id});
                    const email = user.email;
                    let amount = 0;
                    const itemsCompra = [];
                    for(const item of cart.products){
                        const product = products.find(prod => prod._id.toString() === item.id_prod.toString());
                            if(product && product.stock >= item.quantity){
                                const price = product.price;
                                const quantity = item.quantity;
                                
                                    if(userModel.role === 'premiun'){
                                        amount += price * quantity * 0.8;
                                    }else{
                                        amount += price * quantity;
                                    }

                                    product.stock -= quantity;
                                    await product.save();
                                    itemsCompra.push(product.title);
                            }
                    }
                                    
                    await cartsModel.findByIdAndUpdate(cid, { products: [] });
                    res.redirect(`http://localhost:4000/api/tickets/create?amount=${amount}&email=${email}`);
                }else{
                    res.status(404).send({ resultado: 'Not Found', message: cart});
                }
        }catch(error){
            logger.error(`Error al cargar el carrito`);
            res.status(500).send({ error: `Error al cargar el carrito: ${error}`});
        }
}

export const getCarts = async (req, res) =>{
    const limit = req.query;
        try{
            const carts = await cartsModel.find({}).limit(parseInt(limit));
            res.status(carts && carts.length > 0 ? 200 : 404).send({
                resultado: carts && carts.length > 0 ? 'ok' : 'Not fount',
                message: carts && carts.length > 0 ? carts : 'No se encontraron carritos'
            })
        }catch(error){
            logger.error(`Error al mostrar los carritos disponibles`);
            res.status(500).send({ error: `Error al obtener carritos: ${error}` });
        }
}