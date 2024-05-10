import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: 'dxaa ffjo kcrz xvef',
    },
});

export const sendEmail = async (to, subject, html) => {
    console.log("Sending email to: ", to);

    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    const mailData = {
        from: process.env.MAIL_FROM,
        to: to,
        subject,
        html,
    };

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });

    // try {
    //     let info = await transporter.sendMail(mailData);
    //     console.log(`Message sent: ${info.messageId}`);
    // } catch (err) {
    //     console.log("Error while sending email: ", err);
    // }
};


  