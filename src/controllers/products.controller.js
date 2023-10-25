import productsModel from "../models/products.models.jd";

export const getProducts = async (req, res) =>{
    const {limit = 10, page = 1, sort, query, category, status} = req.query;

    try{

        const opciones = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? {price: 1} : sort === 'desc' ? {price: -1} : null
        }
        const filter = {}
        if(query){
            filter.type = query
        }
        if(category){
            filter.type = category
        }
        if(status){
            filter.type = status
        }
        const prods = await productsModel.paginate(filter, opciones);
        res.status(200).send({ resultado: 'OK', message: prods});
    }catch(error){
        res.status(500).send({ error: `Error al consultar los productos: ${error}`});
    }
}

export const getProductsById = async (req, res) =>{
    const {id} = req.params;

    try{
        const prods = await productsModel.findById(id);
        if(prods){
            res.status(200).send({ resultado: 'OK', message: prods});
        }else{
            res.status(404).send({ resultado: 'Not found', message: prods});
        }
    }catch(error){
        res.status(400).send({error: `Error al consultar los productos: ${error}`});
    }
}

export const addProducts = async (req, res) => {

    const { title, description, price, category, stock, code } = req.body
    try{
        const confirmacion = await productsModel.create({ title, description, price, category, stock, code});
        res.status(200).send({ resultado: 'OK', message: confirmacion});
    }catch(error){
        res.status(400).send({ error: `Error al crear el producto ${error}`});
    }
}

export const updateProducts = async (req, res ) =>{

    const {id} = req.params;
    const { title, description, price, category, stock, code, status } = req.body;

    try{
        const confirmacion = productsModel.findByIdAndUpdate(id, {title, description, price, category, stock, code, status});
            if(confirmacion){
                res.status(200).send({ resultado: 'OK', message: confirmacion});
            }else{
                res.status(404).send({ resultado: 'Not found', confirmacion});
            }
    }catch(error){
        res.status(400).send({ error: `No se pudo actualizar el producto: ${error}`});
    }
}

export const deleteProducts = async (req, res) =>{

    const {id} = req.params;
    try{
        const confirmacion = await productsModel.findByIdAndDelete(id);
            if(confirmacion){
                res.status(200).send({ resultado: 'OK', confirmacion});
            }else{
                res.status(404).send({ resultado: 'Not found', confirmacion});
            }
    }catch(error){
        res.status(400).send({ error: `No se pudo eliminar el producto: ${error}`})
    }
}