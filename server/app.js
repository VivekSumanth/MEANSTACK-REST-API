const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// const bookRoute = require('./routes/book');

const app = express();

const PORT = process.env.RDS_PORT || 3306;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use routes
// app.use('/books', bookRoute);



var mysql = require('mysql');

var connection = mysql.createConnection({
                  host     : process.env.RDS_HOSTNAME || 'database-1.ccwtltvba3xn.us-east-1.rds.amazonaws.com',
                  user     : process.env.RDS_USERNAME || 'vivek',
                  password : process.env.RDS_PASSWORD || 'viv230997',
                  port     : PORT,
                  database : 'Books',
                  multipleStatements: true
              });

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.message });
});

app.listen(PORT, () => console.log(`App listening on port:${PORT}`));

// connection.end();

app.post('/books', (req,res)=>{
  let each = req.body
  var sql = "INSERT INTO bookscatalog(name,price,description) VALUES(?,?,?);";
  connection.query(sql,[each.name, each.price, each.description],(err,data) => {
    if(!err)
    res.json(data);
    else
      console.log("correct me " + err)
  })
})

app.get('/books', (req,res)=>{
  let each = req.body
  var sql = "select * from bookscatalog";
  connection.query(sql,(err,data) => {
    if(!err)
    res.json(data);
    else
      console.log("correct me " + err)
  })
})

