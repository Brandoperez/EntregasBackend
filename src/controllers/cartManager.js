import { promises as fs } from 'fs';

export default class CartManager{
    constructor(cartPath, productsPath){
        this.carts = [];
        this.cartPath = cartPath;
        this.productsPath = productsPath
    }

    newCard = async () =>{
        this.carts = JSON.parse(await fs.readFile(this.cartPath, 'utf-8'));
        const cart = {id: CartManager.agregarID(this.carts), products: []}
            this.carts.push(cart);
            const cartNew = JSON.stringify(this.carts);
            await fs.writeFile(this.cartPath, cartNew);
    }

    getProductsByCartId = async (cartId) =>{
        this.carts = JSON.parse(await fs.readFile(this.cartPath, 'utf-8'));
        const cart = this.carts.find((cart) => cart.id === parseInt(cartId));

            if(cart){
                return cart.products;
            }else{
                return [];     
            }
    }
    addProductsToCart = async (cId, pId) =>{
        this.carts = JSON.parse(await fs.readFile(this.cartPath, 'utf-8'));
        const cart = this.carts.find((cart) => cart.id === parseInt(cId));

        const products = JSON.parse(await fs.readFile(this.productsPath, 'utf-8'));
        const product = this.products.find((prod) => prod.id === parseInt(pId));

        if(!product){
            return false;
        }

        if(cart){
            const productoExistente = cart.products.find((prod) => prod.id === parseInt(pId));
                productoExistente
                ? productoExistente.quantity++
                : cart.products.push({id: product.id, quantity: 1});
                const cartNew = JSON.stringify(this.carts);
                await fs.writeFile(this.cartPath, cartNew);
                    return true;
        }else{
            return false;
        }
    }

    static agregarID(carts){
      const ids = carts.map((cart) => cart.id);
      let newID = 1;
      carts.length > 0 && (newID = Math.max(...ids)+1);
      return newID
    }
}

