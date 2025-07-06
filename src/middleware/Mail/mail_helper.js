import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();




export const sendEmail=async (to, subject, content)=>{
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,  // Email gửi
                pass: process.env.MAIL_PASS   // Mật khẩu ứng dụng (App password)
            },
            tls: {
                rejectUnauthorized: false, //Bo qua loi bao mat
            },

        });
        
        const mailOptions = {
            from: "Hệ thống đặt Tour du lịch 5H",// nơi gửi
            to,
            subject,
            text: content,
        };

        const result=await transporter.sendMail(mailOptions);
        console.log('Email sent: ', result.response);
        return result;

        }
        catch(error){
            console.error('Error sending email: ', error);
            throw error;
        }
}