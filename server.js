const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));

cloudinary.config({
  cloud_name: 'akashrashmikara',
  api_key: '126369654527677',
  api_secret: 'sa14m5fo7ICZmLOVSWVKEXnMqiM'
});

app.post('/uploadImage', (req, res) => {
  const base64Image = req.body.base64Image;

  if (!base64Image) {
    return res.status(400).send('Invalid image data.');
  }
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const timestamp = new Date().getTime();
  const imageName = `image_${timestamp}.png`; 
  const imagePath = path.join( '/tmp', imageName);

  fs.writeFile(imagePath, imageBuffer, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).send('Error saving image.');
    }
    console.log('Image saved locally:', imageName);
  });
});

cron.schedule('*/30 * * * * *', async () => {  /*every 30 seconds*/
//cron.schedule('*/10 * * * *', async () => {  /*every 10 minutes*/
//cron.schedule('0 8 * * 1', async () => {    /*every Monday at 8:00 AM*/
//cron.schedule('* * * * *', async () => {  /*every minute*/
console.log("Cloudinary file uplaod is work" );
  const files = fs.readdirSync('images');
  for (const file of files) {
    const imagePath = path.join('images', file);
    try {
      const result = await cloudinary.uploader.upload(imagePath);
      console.log('Image uploaded to Cloudinary:', result.secure_url);
      fs.appendFileSync('secured_url.txt', result.secure_url + '\n');
      fs.unlinkSync(imagePath);
    } catch (error) {
    }
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));

console.log('Server started.');
