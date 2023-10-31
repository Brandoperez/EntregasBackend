import productsModel from '../models/products.models.js';
import cartsModel from '../models/carts.models.js';
import { userModel } from '../models/user.models.js';

export const createCart = async (req, res) => {

    try {
        const respuesta = await cartsModel.create({});
        res.status(200).send({ resultado: "OK", message: respuesta });
      } catch (error) {
        res.status(500).send({ error: `Error al crear producto: ${error}` });
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
            res.status(400).send({ error: `Error al actualizar el producto del carrito ${error}`});
        }
}

export const getCartById = async (req, res) => {
    
    const { cid } = req.params;
    try{
        const cart = await cartsModel.findById(cid).populate('products.product');
        res.status(200).send({ respuesta: 'OK', message: prods});
    }catch(error){
        res.status(400).send({ error: `Error al encontrar el id del carrito ${error}`})
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
                res.status(400).send({ error: `Error al eliminar el producto del carrito ${error}`})
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
        res.status(400).send({error: `Error al eliminar todos los productos ${error}`});
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
        res.status(400).send({ error: `Error al cargar la tarjeta: ${error}`});
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
            res.status(400).send({ error: `Error al actualizar el producto del carrito ${error}`});
        }
}

export const purcharseCart = async (req, res) => {

    const { cid } = req.params;
        try{
            const cart = await cartsModel.findById(cid);
            const products = await productsModel.find();
                if(cart){
                    const user = await usersModel.find({ cart: cart._id});
                    const email = user[0].email;
                    let amount = 0;
                    const itemsCompra = [];
                    cart.products.forEach( async item => {
                        const product = products.find(prod => prod._id == item.id_prod.toString());
                            if(product.stock >= item.quantity){
                                amount += product.price * item.quantity;
                                product.stock -= item.quantity;
                                await product.save();
                                itemsCompra.push(product.title);
                            }
                    });
                    console.log(itemsCompra);
                    await cartsModel.findByIdAndUpdate(cid, { products: [] });
                    res.redirect(`http://localhost:4000/api/tickets/create?amount=${amount}&email=${email}`);
                }else{
                    res.status(404).send({ resultado: 'Not Found', message: cart});
                }
        }catch(error){
            res.status(500).send({ error: `Error al cargar el carrito: ${error}`});
        }
}