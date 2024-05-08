import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = nodemailer.createTransport({ 
    host:process.env.MAIL_HOST, 
    secure: true,
    port: 465,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
    },
});
    

export const sendEmail = async (to, subject, html) => {
    console.log("Sending email to: ", to)
    try{
        let info = await transporter.sendMail({
            from:process.env.MAIL_FROM,
            to,
            subject,
            html,
        });
        console.log(`Message sent: ${info.messageId}`);
    }catch(err){
        console.log("Error while sending email: ", err);
    }
}