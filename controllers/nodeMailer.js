import nodemailer from 'nodemailer';
import { Resend } from 'resend'

import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend('re_9dRvusUd_FJe2krnJYDYRBV2AJCQX3tso')

// let transporter = nodemailer.createTransport({ 
//     host:process.env.MAIL_HOST, 
//     secure: true,
//     port: 465,
//     auth:{
//         user:'resend',
//         pass:'re_9dRvusUd_FJe2krnJYDYRBV2AJCQX3tso',
//     },
// });

export const sendEmail = async (toUser, subject, html) => {
    console.log("Sending email to: ", to)
    try{
        // let info = await transporter.sendMail({
        //     from:process.env.MAIL_FROM,
        //     to,
        //     subject,
        //     html,
        // });

        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [toUser],
            subject,
            html
        });

        console.log(`Message sent: ${data}`);
    }catch(err){
        console.log("Error while sending email: ", err);
    }
}