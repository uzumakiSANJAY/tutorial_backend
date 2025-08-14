const express = require('express');
const multer = require('multer');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

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

// ===== Teacher Registration Route =====
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// ===== POST: Teacher Registration =====
router.post(
    '/register-teacher',
    upload.fields([
        { name: 'resultFile', maxCount: 1 },
        { name: 'idProof', maxCount: 1 }
    ]),
    async (req, res) => {
        const {
            name,
            mobile,
            email,
            address,
            qualification,
            score,
            subject,
            area,
            classes,
            hasLaptop,
            giveDemo
        } = req.body;

        const resultFilePath = req.files?.resultFile ? req.files.resultFile[0].path : null;
        const idProofPath = req.files?.idProof ? req.files.idProof[0].path : null;

        try {
            // Email transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // ===== Mail to You =====
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: 'youremail@example.com', // change to your email
                subject: 'New Teacher Registration',
                html: `
                    <h3>New Teacher Registration</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Mobile:</strong> ${mobile}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>Qualification:</strong> ${qualification}</p>
                    <p><strong>Exam Score:</strong> ${score}</p>
                    <p><strong>Preferred Subjects:</strong> ${subject}</p>
                    <p><strong>Preferred Area:</strong> ${area}</p>
                    <p><strong>Preferred Classes:</strong> ${classes}</p>
                    <p><strong>Laptop:</strong> ${hasLaptop}</p>
                    <p><strong>Comfortable with demo:</strong> ${giveDemo}</p>
                `,
                attachments: [
                    ...(resultFilePath
                        ? [{ filename: path.basename(resultFilePath), path: resultFilePath }]
                        : []),
                    ...(idProofPath
                        ? [{ filename: path.basename(idProofPath), path: idProofPath }]
                        : [])
                ]
            });

            // ===== Thank You Mail to Teacher =====
            const guidelinesPath = path.join(process.cwd(), 'uploads', 'terms', 'Teacher_Guidelines.pdf');
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Thank you for showing interest',
                html: `<p>Dear ${name},</p><p>Thank you for showing interest. We will contact you soon.</p>`,
                attachments: [
                    {
                        filename: 'Teacher_Guidelines.pdf',
                        path: guidelinesPath
                    }
                ]
            });

            res.json({ message: 'Teacher registered, emails sent successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing registration', error: error.message });
        }
    }
);
module.exports = router;
