import {clear} from 'console';
import { promises as fs } from 'fs';

export default class CartManager{
    constructor(path){
        this.carts = [];
        this.path = path;
        this.loadCard();
    }

    newCard = async () =>{
        const cart = {
          id: CartManager.agregarID(),
          products: []
        }
            this.cards.push(card)
            await this.saveCard();
            return card.id;
    }

    saveCard = async () =>{
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
    }
    
    loadCard = async () => {
        const data = await fs.readFile(this.path, 'utf-8');
        this.carts = JSON.parse(data);
    }

    getProductsByCartId = async (cartId) =>{
        console.log("Esto viene por la cardID", cartId)
        console.log(this.carts);
        console.log("Parsed CardId", parseInt(cartId))
        const cart = this.carts.find(cart => cart.id === parseInt(cartId));
            if(cart){
                console.log("esto viene por la card",cart)
                return cart.products;
            }else{
                console.log("cart not fount")
                return [];     
            }
    }

    static agregarID(){
        if(this.idIncrement){
            this.idIncrement++
        }else{
            this.idIncrement = 1;
        }
        return this.idIncrement
    }
}

