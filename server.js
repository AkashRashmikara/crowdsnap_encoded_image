const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv");
dotenv.config();

const sgMail = require('@sendgrid/mail');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));

cloudinary.config({
  cloud_name: 'akashrashmikara',
  api_key: '126369654527677',
  api_secret: 'sa14m5fo7ICZmLOVSWVKEXnMqiM'
});

// app.post('/uploadImage', (req, res) => {
//   const base64Image = req.body.base64Image;

//   if (!base64Image) {
//     return res.status(400).send('Invalid image data.');
//   }
//   const imageBuffer = Buffer.from(base64Image, 'base64');
//   const timestamp = new Date().getTime();
//   const imageName = `image_${timestamp}.png`; 
//   const imagePath = path.join( 'images', imageName);

//   fs.writeFile(imagePath, imageBuffer, 'base64', (err) => {
//     if (err) {
//       console.error('Error saving image:', err);
//       return res.status(500).send('Error saving image.');
//     }
//     console.log('Image saved locally:', imageName);
//   });
// });

cron.schedule('*/30 * * * * *', async () => {
  try {
    
    // const files = fs.readdirSync('images');
    // for (const file of files) {
    //   const imagePath = path.join('images', file);
    //   try {
    //     const result = await cloudinary.uploader.upload(imagePath);
    //     console.log('Image uploaded to Cloudinary:', result.secure_url);
    //     fs.appendFileSync('secured_url.txt', result.secure_url + '\n');
    //     fs.unlinkSync(imagePath);
    //   } catch (error) {
    //   }
    // }
    console.log("Cloudinary file upload is working");
    const sendemail = {
      to: '22ug1-0425@sltc.ac.lk',
      subject: 'Check cloudinary image upload',
      body: 'Image uplaod is works properly',
    };

    
    await sendMail(sendemail);

  } catch (error) {
    console.error('Error in cron job:', error);
  }
});


async function sendMail(json) {

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //console.log("API_KEY", sgMail);
      const msg = {
        to: json.to, // Change to your recipient
        from: 'akashrashmikara@gmail.com', // Change to your verified sender
        subject: json.subject,
        text: json.body,
        html: json.body,
      }

        sgMail
          .send(msg)
          .then((response) => {
            console.log('response',response[0].statusCode)
            console.log(response[0].headers)
          })
          .catch((error) => {
            console.error(error)
          })

      /*
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'azurehasitha@gmail.com',
              pass: '####'
          }
      });

      var mailOptions = {
          from: 'bizchain.io <info@bizchain.io>',
          to: json.to,
          subject: json.subject,
          html: json.body
      };

      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
              // let res = await this.getClient(guid);
              let out = {
                  success: true
              }

              return out;
          }
      });*/


  } catch (err) {
      console.log('err', err);
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));

console.log('Server started.');
