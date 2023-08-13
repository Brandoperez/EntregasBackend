import {clear} from 'console';
import { promises as fs } from 'fs';

export default class CardManager{
    constructor(){
        this.cards = [];
        this.path = './path/card.txt';
        this.loadCard();
    }

    newCard = async () =>{
        const card = {
          id: CardManager.agregarID(),
          products: []
        }
            this.cards.push(card)
            await this.saveCard();
            return card.id;
    }

    saveCard = async () =>{
        await fs.writeFile(this.path, JSON.stringify(this.cards, null, 2), 'utf-8');
    }
    
    loadCard = async () => {
        const data = await fs.readFile(this.path, 'utf-8');
        this.cards = JSON.parse(data);
    }

    getProductsByCardId = async (cardId) =>{
        console.log("Esto viene por la cardID", cardId)
        console.log(this.cards);
        console.log("Parsed CardId", parseInt(cardId))
        const card = this.cards.find(card => card.id === parseInt(cardId));
            if(card){
                console.log("esto viene por la card",card)
                return card.products;
            }else{
                console.log("card not fount")
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

