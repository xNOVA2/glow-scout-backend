import nodeMailer from 'nodemailer';

class Mailer {
    static async sendEmail({ email, subject, message }) {
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html: message,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
        } catch (error) {
            console.log(error);
        }
    }
}

export default Mailer
