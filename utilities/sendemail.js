import nodemailer from 'nodemailer'


const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })
    const mailOptions = {
        from:'avishektiwari584@gmail.com',
        to:options.to,
        subject:options.subject,
        text:options.text
    }
    await transporter.sendMail(mailOptions) 
}
// await transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('Error occurred:', error);
//       }
//       console.log('Email sent');
//     });

export default sendEmail