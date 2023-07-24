class ProductManager{
    constructor(){
        this.products = []; 
    }

    getProducts(){
        return this.products;
    }

    addProducts = (title, description, precio, thumbnail, code, stock=5)=>{
        const producto = {
            title,
            description, 
            precio,
            thumbnail,
            code,
            stock
        }
            if(this.products.length === 0){
                producto.id = 1;
            }else{
                producto.id = this.products[this.products.length -1].id+1
            }
                this.products.push(producto);
                

                    for(let i = 0; i < producto.length; i++){
                        console.log(producto[i]);
         }
    }

    getProductsByID(idProducto){
        const productoID = this.products.findIndex(e=>e.id === idProducto);
            if(productoID === -1){
                console.log("El producto no fue encontrado");
            }else{
                console.log("Se encontró el producto")
            }

            this.products.push(idProducto); 

    }
}

const productos = new ProductManager();
productos.addProducts("MotorHD", "Este es un buen motor", 3000, "Sin imagen", "123acb", 2);
productos.addProducts("Notebook Lenovo", "Este es un buena Lenovo", 60000, "Sin imagen", "867kjh", 5);
productos.addProducts("TelevisorLG", "Este es un televisor", 8000, "Sin imagen", "456hgt", 2);
console.log(productos)