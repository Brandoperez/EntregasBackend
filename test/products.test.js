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
        let token = {};
        let getProductCreated = null;

            before(async function() {
                try{
                    this.timeout(7000);
                    getProductCreated = await ProductModel.findOne({ code: "Arr123"});

                    const credentialsAdmin = {
                    email: process.env.EMAIL_CREDENTIALS,
                    password: process.env.PASSWORD_CREDENTIALS
                };
                console.log('Credenciales:', credentialsAdmin);
                    const response = await requester.post('/api/users/login').send(credentialsAdmin);
                    const { __body } = response;
                    const tokenResult = response.header['jwt-cookie'][0];

                    expect(tokenResult).to.be.ok
                    expect(response.status).to.be.equal(200)

                    this.token = {
                        name: tokenResult.split("=")[0],
                        value: tokenResult.split("=")[1]
                    }

                    console.log("Token:", this.token);

                        expect(token.value).to.be.ok
                        expect(token.name).to.be.equal('jwtCookie')
                        console.log(`Token: ${token.name} = ${token.value}`)

                }catch(error){
                    logger.error("Error en la sección before:", error);
                    throw error;
                }
                 
            });
    });

    describe('Test para traer productos', function (){
        it('Test endpoint: GET /api/products, se espera que traiga un array de productos', async () => {
            const response = await requester.get('/api/products/');
            expect(response.body.message.docs).to.be.an('array');
        })
    });

    describe('Test traer un producto por su ID', function () {
        it('Test endpoint: GET /api/products/:id, se espera un producto por id', async () => {
            const response = await requester.get('/api/products/64f9158f87fb03d3da94e2db');
            expect(response.body.message).to.be.an('object');
        });
    });

    describe('Test de creacion de productos', function () {
        it('Test endpoint: POST /api/products, se espera crear un nuevo producto', async function() {

            try{
                const response = await requester.post('/api/products')
                .set("Cookie", `jwtCookie=${this.token.value}`)
                .send({
                        "title": "Mantequilla",
                        "description": "Producto a base de margarina con exceso en grasa y exceso en sodio.",
                        "price": 900,
                        "stock": 10,
                        "category": "lacteos",
                        "status": true,
                        "code": `ProdPrueba`,
                        "thumbnails": []
                    });
                expect(response.body.message).to.be.an('object');
            }catch(error){
                logger.error({ error: `Error al hacer test para crear un producto: ${error}`})
            }
        });
    });

    describe('Test para actualizar productos', function (){
        it('Test endpoint: PUT /api/products/id, se espera actualizar un producto por su id', async () =>{
            try{
                const response = await requester.put(`/api/products/${getProductCreated._id}`)
                .set("Cookie", `jwtCookie=${this.token}`)
                .send({
                    price: Math.floor(Math.random() * 100)
                });
                logger.info(response.body);
                expect(response.body.message).to.be.an('object');
            }catch(error){
                logger.error(`Error al hacer test para actualizar un producto: ${error}`);
              
            }
        });
    });
    after(async function () {
        try {
            await ProductModel.deleteOne({ code: "ProdPrueba" });
            logger.info("Producto eliminado");
        } catch (error) {
            logger.error(`Error al eliminar un producto: ${error}`);
            throw error;
        }
    });

