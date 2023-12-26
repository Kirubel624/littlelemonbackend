const express = require('express');
const cors = require('cors');
const app = express();
const reserveRoute=require('./routes/reserveRoutes')
const authRouter = require("./routes/authRoutes");

app.use(cors({
    origin:'*'
}));


app.use(express.json());
app.use('/api/v1/',reserveRoute);
app.use("/api/v1/", authRouter);


module.exports = app