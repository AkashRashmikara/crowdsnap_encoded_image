const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

const connectionString = process.env.TIDB_URL;

const db = mysql.createConnection(connectionString);


db.connect((err) => {
  if (err) {
    console.error('TiDB Connection Error:', err);
  } else {
    console.log('Connected to TiDB');
  }
});

app.get('/', (req, res) => {
    db.query('SELECT * FROM USER', (error, results) => {
      if (error) {
        console.error('TiDB Query Error:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
