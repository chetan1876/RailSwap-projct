const transporter = require("../../config/mail");

const sendEmail = async ({ to, subject, html }) => {

    try {

        const info = await transporter.sendMail({

            from: process.env.EMAIL_FROM,

            to,

            subject,

            html,

        });

        return info;

    } catch (error) {

        throw error;

    }

};

module.exports = {
    sendEmail,
};