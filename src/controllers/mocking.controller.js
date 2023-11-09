import faker from "faker";
import productModel from "../models/products.models";

export const generateProductsMocking = async (req, res) => {
    try{
        for(let i = 0; i < 15; i++){
            const productData = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                stock: faker.datatype.number({ min: 10, max: 100 }),
                category: faker.commerce.department(),
                status: true,
                code: faker.random.alphaNumeric(10),
                thumbnails: [faker.image.imageUrl()]
            }
                 await productModel.create(productData);
        }
        res.status(200).send({ message: "Productos de prueba creados"});
    }catch(error){
        res.status(500).send({error: `Error al crear los productos de prueba ${error}`});
    }
}