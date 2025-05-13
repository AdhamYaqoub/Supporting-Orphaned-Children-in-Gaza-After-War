const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    
      user: 'adhamyaqouc@gmail.com',
    pass: 'kbdh nkwg jvpa kydp'
  }
});

transporter.sendMail({
  from: 'adhamyaqouc@gmail.com',
  to: 'amamry2021.2002@gmail.com', // جرّب ترسل لنفسك أولًا
  subject: 'Test Email from Node.js',
  text: '🎉 Hello Adham! This is a test email sent using Nodemailer in Node.js.',
}, (error, info) => {
  if (error) {
    return console.log('❌ Error sending email:', error);
  }
  console.log('✅ Email sent:', info.response);
});
