import { clear } from 'console';
import {promises as fs} from 'fs';


class ProductManager{ 
    constructor(){

        this.products = []; 
        this.path = './files/productos.txt';
    } 
   
    getProducts = async () =>{
        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        console.log(this.products);
    }

    addProducts = async(product) =>{

        if(this.products.find(prod => prod.code == product.code)){
            return "Ya hay un producto con este código";
        }
        if(product.code !="" || product.code >= 0){
            this.products.push(product);
        }else{
            return "No se puede cargar un producto vacio"
        }

            this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
                if(this.products.find(producto => producto.id == product.id)){
                    return "El producto ha sido agregado correctamente";
                }
                this.products.push(product)
                await fs.writeFile(this.path, JSON.stringify(this.products))

        }

    getProductsByID = async(idProducto) => {

        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const productoID = this.products.find(e=>e.id === idProducto);
            if(productoID){
                console.log(productoID);
            }else{
                console.log("No se encontró el producto")
            }

            this.products.push(idProducto); 

    }

    updateProducts = async(id, {title,description,price,thumbnail,stock}) =>{

        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const indice = this.products.findIndex(prod => prod.id === id);

            if(indice != -1){
                this.products[indice].title = title;
                this.products[indice].description = description;
                this.products[indice].price = price;
                this.products[indice].thumbnail = thumbnail;
                this.products[indice].stock = stock;

                await fs.writeFile(this.path, JSON.stringify(this.products));
            }else{
                console.log("Producto no encontrado");
            }
    }

    deleteProducts = async(id) =>{

        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const prods = this.products.filter(prod => prod.id != id);
        await fs.writeFile(this.path, JSON.stringify(prods))
    }
}
class Product{
    constructor(title, description, price, thumbnail, code, stock){
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.code = code,
        this.stock = stock,
        this.id = Product.incrementarID()
    }
        static incrementarID(){
            if(this.idIncrement){
                this.idIncrement++
            }else{
                this.idIncrement = 1;
            }
            return this.idIncrement
        }
}




const newProducts ={
    title: 'Heladera LG',
    description: 'Heladera ultima genaración', 
    precio: 50000,
    thumbnail: 'sample/uri/thumbnail.jpg',
    code: '876hbjf',
    stock: 10
}


const producto = new Product(newProducts);
const productManager = new ProductManager();

productManager.addProducts(producto)
productManager.getProducts();
productManager.updateProducts(1 , {title : "Heladera LG", description: "Esta es una super heladera", precio: 30000, stock : 10})
productManager.deleteProducts()
productManager.getProductsByID(1)
