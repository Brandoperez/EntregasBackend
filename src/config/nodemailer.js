import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import 'dotenv/config';

const storeName = 'Anclados';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN',
    }
});

export const recoveryEmail = async (email, recoveryLink) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Restablecer Contraseña',
        html: `<p>Haz click en el siguiente enlace para restablecer tu contraseña <a href="${recoveryLink}"></a></p><br/>`
    };

    try{
        transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            logger.error(`Error al enviar el correo ${error}`);
        }else{
            logger.info('Correo enviado éxitosamente')
        }
    });
    }catch(error){

    }
     
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
                transporter.sendMail(mailOptions, (error, info) =>{
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