import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import logger from "../src/utils/logger.js";
import 'dotenv/config'; 

const expect = chai.expect;
const requester = supertest(process.env.APP_BASE_URL);

await mongoose.connect(process.env.URL_MONGO)
.then(() => logger.info("BD conectada desde TEST"))
.catch((error) => logger.error("Error en conexión a mongoDB atlas desde TEST:", error));

    describe('Test de usuarios en eccomerce', function () {
        it('Test endpoint: POST /api/users/register, se espera crear un nuevo usuario', async function () {
                try{
                    const response = await requester.post('/api/users/register')
                    .send({
                        first_name: "Micaela",
                        last_name: "Prueba",
                        email: 'mika@gmail.com',
                        password: "1234",
                        age: 25
                    });
                    expect(response.body.message).to.equal('Usuario creado satisfactoriamente');
                }catch(error){
                    logger.error({ error: `Error al hacer test para registrar un usuario: ${error}`})
                }
        });
    });

    describe('Test de usuarios', function () {
        it('Test endpoint: POST /api/users/login, se espera iniciar sessión con un usuario registrado', async function (){
            try{
                const response = await requester.post('/api/users/login')
                .send({
                    email: 'mika@gmail.com',
                    password: "1234",
                })
                logger.info(response.body);
                expect(response.body.message).to.equal("Inicio de session exitoso")
            }catch(error){
                logger.error({ error: `Error al hacer test para iniciar sessión con un usuario: ${error}`})
            }
        }).timeout(6000);
    });
    
    describe('Test de usuarios', function () {
        it('Test endpoint: GET /api/users/logout, se espera cerrar la sessión', async function (){
            try{
                const response = await requester.get('/api/users/logout');
                expect(response.body.message).to.equal('Sesión cerrada con éxito');
            }catch(error){
                logger.error({ error: `Error al hacer test para cerra la sessión del usuario: ${error}`})
            }
        })
    })