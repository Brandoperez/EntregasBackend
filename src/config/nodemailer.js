import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN',
    }
});

function recoveryEmail(email, recoveryLink) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Restablecer Contraseña',
        html: `<p>Haz click en el siguiente enlace para restablecer tu contraseña <a href="${recoveryLink}"></a></p><br/>`
    };

    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            logger.error(`Error al enviar el correo ${error}`);
        }else{
            logger.info('Correo enviado éxitosamente')
        }
    });
}

export default recoveryEmail;