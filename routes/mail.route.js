const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-mail', async (req, res) => {
    const { firstName, lastName, email, phone, className: studentClass, subject } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            // to: 'skillcoachtutorial@gmail.com',
            to: "hellopagal123@yopmail.com",
            subject: 'New Demo Class Request',
            html: `
        <h3>New Demo Request</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Class:</strong> ${studentClass}</p>
        <p><strong>Subject:</strong> ${subject}</p>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Email sending failed', error: error.message });
    }
});

module.exports = router;
