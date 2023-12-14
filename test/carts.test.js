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
        })
        
    })