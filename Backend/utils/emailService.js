const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // false for 587, uses STARTTLS
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        family: 4, // Force IPv4
        logger: true,
        debug: true
    });

    // Define email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
