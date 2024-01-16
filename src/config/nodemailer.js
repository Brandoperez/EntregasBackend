import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import 'dotenv/config';

const storeName = 'Anclados';
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVICE,
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN',
    }
});

export const recoveryEmail = async (email, recoveryLink) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Restablecer Contraseña',
        html: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
        
                .container {
                    background-color: #fff;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    border-radius: 8px;
                }
        
                h1 {
                    font-size: 24px;
                    text-align: center;
                    color: #333;
                }
        
                p {
                    font-size: 16px;
                    margin: 10px 0;
                }
        
                strong {
                    font-weight: bold;
                }
        
                .code {
                    background-color: #007bff;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 4px;
                }
        
                .amount {
                    font-size: 18px;
                    color: #007bff;
                    font-weight: bold;
                }
        
                .purchase {
                    font-size: 14px;
                    color: #333;
                }
        
                .footer {
                    margin-top: 20px;
                    text-align: center;
                }
        
                .footer p {
                    font-size: 12px;
                    color: #333;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <h1>Recuperar contraseña</h1>
                <p>Para recuperar tu contraseña, haz click en el siguiente enlace:</p>
                <p><a href="${recoveryLink}">Recuperar contraseña</a></p>
                <p>Si no has solicitado recuperar tu contraseña, ignora este mensaje.</p>
                <div class="footer">
                    <p>© 2023 Tienda Online. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>`
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info('Correo enviado éxitosamente');
      } catch (error) {
        logger.error(`Error al enviar el correo ${error.message}`);
      }
    ;
     
}

export const sendTicket = async (req, res, {ticket}) =>{
    const { code, amount, purchaser, purchase_datetime } = ticket;
        try{
            const mailOptions = {
                from: process.env.EMAIL_SERVICE,
                to: purchaser,
                subject: `Ticket de compra en ${storeName}`,
                html: `
                <!DOCTYPE html>
            <html>
            <head>
                <!-- Estilos y etiquetas de estilo aquí -->
            </head>
            <body>
                <div class="container">
                    <h1>Ticket de compra</h1>
                    <p>Gracias por su compra en <span class="storeName">${storeName}</span>.</p>
                    <p><strong>Código de Ticket:</strong> <span class="code">${code}</span></p>
                    <p><strong>Monto de Compra:</strong> <span class="amount">$${amount}</span></p>
                    <p><strong>Fecha y Hora de Compra:</strong> <span class="datetime">${purchase_datetime}</span></p>
                </div>
            </body>
            </html>
                `,
            }
                await transporter.sendMail(mailOptions, (error, info) =>{
                    if(error){
                        logger.error(`Error al enviar el ticket ${error}`);
                        res.status(400).send({ error: `Error al enviar el ticket ${error}`});
                    }else{
                        logger.info(`Ticket enviado satisfactoriamente ${purchaser}`);
                        res.status(200).send({resultado: 'OK', message: info})
                    }
                });
        }catch(error){
            logger.error(`Error al enviar ticket: ${error}`);
            res.status(500).send({ error: `Error al enviar ticket: ${error}` });
        }
}

export const sendAccountDeletion = async (email) =>{
    try{
        const mailOptions = {
            from: process.env.EMAIL_SERVICE,
            to: email,
            subject: 'Cuenta Eliminada',
            html: `
                        <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>

            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
                <div style="background-color: #fff; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); padding: 20px; border-radius: 8px;">
                    <h1 style="font-size: 24px; text-align: center; color: #333; margin-bottom: 20px;">Cuenta eliminada por inactividad</h1>
                    <p style="font-size: 16px; margin: 10px 0;">Se ha eliminado su cuenta de usuario en <span style="color: #007bff; font-weight: bold;">${storeName}</span>.</p>
                </div>
            </body>

            </html>
            `,
        } 
        await transporter.sendMail(mailOptions)
        logger.info(`Correo enviado a ${email}`);
        return {resultado: 'OK', message: `Correo electrónico enviado a ${email}`}
    }catch(error){
        logger.error(`Error al enviar email: ${error}`);
        res.status(500).send({ error: `Error al enviar email: ${error}` });
    }
}
export default recoveryEmail;