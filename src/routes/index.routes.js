import { Router } from "express";
import productsModel from "../models/products.models.js";

const routerIndex = Router();

routerIndex.get('/', async (req, res) =>{
    const { page = 1, limit = 5 } = req.query;

    try{
        const user = req.session.user;

        let bienvenida = "Inicia sessión antes de continuar"; 
        let mostrarBoton = false;

        if(user){
            if(user.rol === 'admin'){
                bienvenida = "Bienvenido al sistema administrador";    
            } else if(user.first_name){
                bienvenida = `Bienvenido al sistema ${user.first_name}`;
            }
        }
        console.log(bienvenida)

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        }
        const resultado = await productsModel.paginate({}, options);
         
                res.render('index', {
                bienvenida: bienvenida,
                products: resultado.docs,
                hasPrevPage: resultado.hasPrevPage,
                hasNetxPage: resultado.hasNetxPage,
                prevPage: resultado.prevPage,
                netxPage: resultado.netxPage
        }); 
    }catch(error){
        res.status(400).send({error: `Error al cargar pagina principal ${error}`});
    }
})

export default routerIndex