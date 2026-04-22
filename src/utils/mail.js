// Here i make two mail template for one is verify-email and second one is forgot-password e-mail

import { text } from "express";
import Mailgen from "mailgen";

import nodemailer from "nodemailer";


const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanager.com"
        }
    })

    const emailPlaintext = mailGenerator.generatePlaintext(options.mailgenContent);
    const emialHtml = mailGenerator.generate(options.mailgenContent);

    const transpoter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOSTNAME,
        port: process.env.MAILTRAP_PORTNAME,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD
        }
    });

    const mail = {
        from: "taskmanger@gmail.com",
        to: options.email,
        subject: options.subject,
        text: emailPlaintext,
        html: emialHtml
    }

    try {
        await transpoter.sendMail(mail);
    } catch (error) {
        console.error("Email Services is failed. Make sure that you have provided correct credential.");
    }
}

const mailVerificationMelgenContent = (username, emailVerifyUrl) => {
    const email = {
        body: {
            name: username,
            intro: 'Welcome to our App! We\'re very excited to have you on board.',
            action: {
                instructions: 'To verify your email, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: emailVerifyUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    return email;
}

const forgotPasswordMelgenContent = (username, passwordUrl) => {
    const email = {
        body: {
            name: username,
            intro: "We got a request to reset the password of your account.",
            action: {
                instructions: "If you want to forgot the password , please click here.",
                button: {
                    color: "#22BC66",
                    text: "Reset-password",
                    link: passwordUrl
                }
            },
            outro: "Need help, or have questions? Just reply to this email, we\'d love to help."
        }
    }
}

export {
    mailVerificationMelgenContent,
    forgotPasswordMelgenContent,
    sendMail
}