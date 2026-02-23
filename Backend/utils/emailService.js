const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // 1. Validate environment variables before trying to send
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('❌ EMAIL ERROR: Missing EMAIL_USER or EMAIL_PASS in environment variables.');
            throw new Error('Email credentials are not fully configured.');
        }

        // 2. Create the transporter securely
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3. (Optional but helpful) Verify connection configuration
        try {
            await transporter.verify();
            console.log('✅ Nodemailer: Connection strictly verified with Gmail SMTP server.');
        } catch (verifyError) {
            console.error('❌ Nodemailer Verification Failed:', verifyError.message);
            console.error('👉 Tip: Check if your Google App Password is correct or if your Gmail account requires 2FA adjustments.');
            throw verifyError;
        }

        const mailOptions = {
            from: `SpeakSpace <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message
        };

        // 4. Send the email and log success
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Nodemailer Success: Email successfully delivered to ${options.email} (MessageID: ${info.messageId})`);

        return info;

    } catch (err) {
        console.error('----------------------------------------------------');
        console.error('❌ FATAL EMAIL DELIVERY ERROR');
        console.error(`Attempted target: ${options.email}`);
        console.error(`Error Code: ${err.code || 'N/A'}`);
        console.error(`Error Message: ${err.message}`);
        console.error(`Full Stack Trace: ${err.stack}`);
        console.error('----------------------------------------------------');
        throw err;
    }
};

module.exports = sendEmail;
