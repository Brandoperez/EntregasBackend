import { Router } from "express";
import  CardManager  from "../controllers/cardManager.js";

const cardManager = new CardManager('../path/card.txt');

const routerCard = Router();

routerCard.get('/:cid', async (req, res) =>{
    const { cid } = req.params;
    const products = await cardManager.getProductsByCardId(parseInt(cid));

    res.json({products});

})

routerCard.post('/:cid/product/:pid', async (req, res) =>{
    const {cid, pid} = req.params;

        const cardId = parseInt(cid);
        const card = await cardManager.cards.find(card => card.id === cardId);

            if(!card){
                res.send(404).json({ message: "No se pudo encontrar" });
            }

            const productoExistente = card.products.find(product => product.product === pid)
                if(productoExistente){
                    productoExistente.quantity++
                }else{
                    card.products.push({product: 1, quantity: 1});
                }

        await cardManager.saveCard();

        res.json(card);
})



export default routerCard;