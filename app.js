const express = require('express')
const app = express()
var cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

app.use(cors())

const captchaRoutes = require('./routes/captcha')
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/captcha', captchaRoutes)


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    console.log("Server running at ", port)
    res.status(error.status || port);
    console.log(error);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port,()=>{
    console.log(`Running at port:${port}`)
})

module.exports = app;