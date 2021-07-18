const keys = require("./keys");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Postgres Client Setup
const { Pool } = require("pg");

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const PORT = process.env.RDS_PORT || 5000;

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS tableName(name varchar, price Integer, description varchar)")
    .catch((err) => console.error(err));
});


app.listen(PORT, () => console.log(`App listening on port:${PORT}`));

// connection.end();
app.get("/", (req, res) => {
  res.send("connected to 5000");
});

app.post("/books", async (req, res) => {
  let each = req.body
  console.log(req.body)
  pgClient.query("INSERT INTO bookscatalog(name,price,description) VALUES($1, $2, $3);",[each.name,each.price,each.description],(err,data) => {
        if(!err)
        res.json(data);
        else
          console.log("correct me " + err)
      });
});

app.get('/books', async (req, res) => {
  // try{
  //   const values = await pgClient.query("SELECT * from bookscatalog");
  //   res.json(values.rows)
  // }catch(err){
  //   console.error(err.message)
  // }
  const values = await pgClient.query("SELECT * from bookscatalog");

  res.send(values.rows);
});


