import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import logger from "../src/utils/logger.js";
import 'dotenv/config'
import ProductModel from "../src/models/products.models.js";
import { before} from "mocha";


const expect = chai.expect;
const requester = supertest(process.env.APP_BASE_URL);

await mongoose.connect(process.env.URL_MONGO)
.then(() => logger.info("BD conectada desde TEST"))
.catch((error) => logger.error("Error en conexión a mongoDB atlas desde TEST:", error));

    describe('Test de productos en eccomerce', function () {
        let token;
        let cookie;
        let getProductCreated = null;

            before(async function() {

                const credentialsAdmin = {
                    email: process.env.EMAIL_CREDENTIALS,
                    password: process.env.PASSWORD_CREDENTIALS
                };

                const response = await requester.post('/api/users/login').send(credentialsAdmin);
                logger.info(response.body);
                cookie = response.headers['set-cookie'][0];
                console.log(cookie)
                //logger.info(cookie);
                token = response.body.token

                getProductCreated = await ProductModel.findOne({ title: "Mantequilla"});
            });
    });

    describe('Test de creacion de productos', function () {
        it('Test endpoint: POST /api/products, se espera crear un nuevo producto', async function() {
            try{
                console.log("El valor de la cookie es:", cookie)
                const response = await requester.post('/api/products')
                .set("Cookie", cookie).send({
                        "title": "Mantequilla",
                        "description": "Producto a base de margarina con exceso en grasa y exceso en sodio.",
                        "price": 900,
                        "stock": 10,
                        "category": "lacteos",
                        "status": true,
                        "code": `PROD${Date.now()}`,
                        "thumbnails": []
                    }
                );
                logger.info(response.body)
                expect(response.body.title).to.equal('Mantequilla');
            }catch(error){
                logger.error({ error: `Error al hacer test para crear un producto: ${error}`})
            }
        });
    });

    describe('Test para actualizar productos', function (){
        it('Test endpoint: PUT /api/products/id, se espera actualizar un producto por su id', async () =>{
            try{
                const response = await requester.put(`/api/products/${getProductCreated._id}`)
                .set("Cookie", cookie)
                .send({
                    price: Math.floor(Math.random() * 100)
                });
                logger.info(response.body);
                expect(response.body.message).to.be.an('object');
            }catch(error){
                logger.error(`Error al hacer test para actualizar un producto: ${error}`);
            }
        })
    })

    describe('Test para traer productos', function (){
        it('Test endpoint: GET /api/products, se espera que traiga un array de productos', async () => {
            const response = await requester.get('/api/products/');
            expect(response.body.message.docs).to.be.an('array');
        })
    });