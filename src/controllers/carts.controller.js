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

export const getCartById = async (req, res) => {
    
    try{
        const { cid } = req.params;
        const cart = await cartsModel.findOne({ _id: cid}).populate('products.id_prod');
        cart ? res.status(200).send({ respuesta: 'OK', message: cart}) : res.status(404).send({error: 'No se encontró el carrito'});
    }catch(error){
        logger.error(`Error al obtener el carrito ${error}`);
        res.status(500).send({ error: `Error al encontrar el id del carrito ${error}`})
    }
}

export const addProductToCart = async (req, res) =>{

    try{ 
        const {cid, pid} = req.params;
        const cartId = cid;
        const cart = await cartsModel.findById(cartId)
            if(cart){
                const productoExistente = cart.products.find(product => product.product === pid);
                    if(productoExistente){
                        productoExistente.quantity++
                        }else{
                            cart.products.push({ product: pid, quantity: 1})
                        }

            logger.info('Productos agregados al carrito')
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

        try{
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const cart = await cartsModel.findById(cid);
            const findIndex = cart.products.findIndex(product => product.id_prod._id.equals(pid));
            if(findIndex !== -1){
                cart.products[findIndex].quantity = quantity;
            }else{
                cart.products.push({ id_prod: pid, quantity: quantity });
            }
                await cart.save();
                logger.info(`La cantidad del producto ${cid} se modifico correctamente`)
                return res.status(200).send({ resultado: 'OK', message: 'La cantidad se actualizo correctamente'});
            
        }catch(error){
            logger.error(`Error al actualizar el producto del carrito`);
            res.status(500).send({ error: `Error al actualizar el producto del carrito ${error}`});
        }
}

export const updateCart = async (req, res) =>{
    
    const { cid } = req.params;
    const  UpdateProduct    = req.body;

        try{
            const cart = await cartsModel.findById(cid);
            if(!cart){
                res.status(404).send({ resultado: 'Not found', message: 'Producto no encontrado'});
            }

            if (!Array.isArray(UpdateProduct)) {
                return res.status(400).send({ error: 'El campo UpdateProduct debe ser un array' });
            } 

            UpdateProduct.forEach( product => {
                const existingProduct = cart.products.find(prod => prod.id_prod._id.equals(product.id_prod));
                    if(existingProduct){
                        existingProduct.quantity += product.quantity;
                    }else{
                        cart.products.push(product);
                    }
            });

            await cart.save();
            logger.info('Carrito actualizado')
            return res.status(200).send({ resultado: 'OK', message: "Carrito actualizado correctamente"});
        }catch(error){
            logger.error(`Error al actualizar el carrito ${error}`);
            return res.status(500).send({ error: `Error al actualizar el producto del carrito ${error}`});
        }
}


export const deleteProductFromCart = async (req, res) => {

            try{
                const { cid, pid} = req.params;
                const cart = cartsModel.findById(cid);
                if (!cart) {
                    return res.status(404).send({ resultado: 'Not found', message: 'Carrito no encontrado' });
                  }
                if (!cart.products) {
                    return res.status(404).send({ resultado: 'Not found', message: 'Carrito no contiene productos' });
                  }

                const findIndex = cart.products.findIndex(product => product.id_prod._id.equals(pid));
                if(findIndex !== -1){
                    cart.products.splice(findIndex, 1);
                    await cart.save();
                    logger.info('Productos eliminados del carrito');
                    return res.status(200).send({ resultado: 'OK', message: 'Producto eliminado con éxito' });
                }else{
                    logger.info('Error al eliminar los productos');
                    return res.status(404).send({ resultado: 'Not found', message: 'Producto no encontrado en el carrito' });
                }

            }catch(error){
                logger.error(`Error al eliminar el producto del carrito ${error}`);
                res.status(500).send({ error: `Error al eliminar el producto del carrito ${error}`})
            }
}

export const deleteCart = async (req, res) =>{

    const {cid} = req.params;
    try{
        const cart = await cartsModel.findById(cid);
        if(!cart){
            res.status(404).send({ resultado: 'not found', message: "Carrito no encontrado"});
        }
        cart.products = [];
        await cart.save();

        logger.info('Carrito eliminado con éxito')
        res.status(200).send({ resultado: 'OK', message: 'el carrito ha sido elimando'});
    }catch(error){
        logger.error(`Error al eliminar el carrito ${error}`);
        res.status(500).send({error: `Error al eliminar el carrito ${error}`});
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
                    res.redirect(`http://localhost:3000/api/tickets/create?amount=${amount}&email=${email}`);
                }else{
                    res.status(404).send({ resultado: 'Not Found', message: cart});
                }
        }catch(error){
            logger.error(`Error al cargar el carrito`);
            res.status(500).send({ error: `Error al cargar el carrito: ${error}`});
        }
}
