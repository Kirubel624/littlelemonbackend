const http=require('http')
const app=require('./app');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const server = http.createServer(app)
dotenv.config({
    path: "./config.env",
  });
  
  const db = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );
  
mongoose
  .connect(
    // process.env.LOCAL_DB,
    db,
  )
  .then(() => {
    console.log("Db connection successful! ..........");
  });

server.listen(8000,'0.0.0.0',()=>{
    console.log('listening on port 8000')
})