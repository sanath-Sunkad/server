var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('./config');

var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 465,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var city = req.body.city
  var phone = req.body.phone
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n City: ${city}\n Phone: ${phone} \n message: ${message} `

  var mail = {
    from: name,
    to: 'sanathbuisness@gmail.com',  // Change to email address that you want to receive messages on
    subject: 'ZabTech Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })

      transporter.sendMail({
        from: "<your email address>",
        to: email,
        subject: "Submission was successful",
        text: `Thank you for contacting us!\n\nForm details\nName: ${name}\n City: ${city}\n Phone: ${phone}\nEmail: ${email}\nMessage: ${message}`
      }, function(error, info){
        if(error) {
          console.log(error);
        } else{
          console.log('Message sent: ' + info.response);
        }
        });
    }
  })
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(3002)