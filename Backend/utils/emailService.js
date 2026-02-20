const { Resend } = require('resend');

const sendEmail = async (options) => {
    // Initialize Resend with the API key from environment variables
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            // Note: Until you verify a custom domain in Resend, 
            // you must strictly send from 'onboarding@resend.dev'
            from: 'SpeakSpace <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            html: options.message
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw error;
        }

        console.log('Email successfully sent via Resend API:', data.id);
    } catch (err) {
        console.error('Failed to send email via Resend:', err);
        throw err;
    }
};

module.exports = sendEmail;
