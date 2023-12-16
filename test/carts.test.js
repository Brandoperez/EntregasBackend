import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import logger from "../src/utils/logger.js";
import 'dotenv/config'
import { before} from "mocha";


const expect = chai.expect;
const requester = supertest(process.env.APP_BASE_URL);

await mongoose.connect(process.env.URL_MONGO)
.then(() => logger.info("BD conectada desde TEST"))
.catch((error) => logger.error("Error en conexión a mongoDB atlas desde TEST:", error));

    describe('Test de productos en eccomerce', function () {
        let token;
        let cookie;

            before(async function() {
                const credentialsAdmin = {
                    email: process.env.EMAIL_CREDENTIALS,
                    password: process.env.PASSWORD_CREDENTIALS
                };

                const response = await requester.post('/api/users/login').send(credentialsAdmin);
                logger.info(response.body);
                cookie = response.headers['set-cookie'];
                logger.info(cookie);
                token = response.body.token
            });
    });

    describe('Test de creacion de carrito para el eccomerce', function () {
        it('Test endpoint: POST /api/carts, se espera crear un nuevo carrito', async function () {
            try{
                const response = requester.post('/api/carts/')
                .set("Cookie", cookie)
                logger.info(response.body);
                expect(response.body.products).to.be.empty;
            }catch(error){
                logger.error({ error: `Error al hacer test para crear un nuevo carrito: ${error}`})
            }
        });
    });

    describe('Test para agregar productos al carrito', function () {
        it('Test endpoint: POST /api/carts/:cid/products/:pid, se espera agregar un producto al carrito', async function () {
            try{
                const cartId = '6533d5298e727a6fa7554bab';
                const productId = '64f9158f87fb03d3da94e2db';
                const response = await requester.post(`/api/carts/${cartId}/products/${productId}`)
                    .set("Cookie", cookie)
                    .send({
                         quantity: 1
                    });
                logger.info(response.body);
                expect(response.body.products).to.equal('OK')
            }catch(error){
                logger.error({ error: `Error al cargar productos en el carrito: ${error}`});
            }
        });
    });

    describe('Test para realizar la compra', function () {
        it('Test endpoint: POST /api/carts/:cid/purcharse, se espera comprar el carrito', async function () {
            try{
                const cartId = '6533d5298e727a6fa7554bab';
                const response = await requester.post(`/api/carts/${cartId}/purchase`)
                    .set("Cookie", cookie)
                    logger.info(response.body);
                    expect(response.body.message).to.equal('Compra finalizada');
            }catch(error){
                logger.error({ error: `Error al comprar el carrito: ${error}`});
            }
        })
    })