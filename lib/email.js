const nodemailer = require('nodemailer');
import Responder from './expressResponder';

const shootMail = (sendersEmail, recieversEmail, subject, body) => {
  nodemailer.createTestAccount((err, account) => {
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'iwantsomethingjustlikethis212@gmail.com', // generated ethereal user
        pass: 's@m@rthgupt@' // generated ethereal password
      }
    });

    let mailOptions = {
      from:  '<' + sendersEmail + '>', // sender address
      to: recieversEmail, // reciever address
      subject: subject, // Subject line
      text: body // plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw error;
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};

export default shootMail;