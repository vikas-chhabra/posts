const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const body_parser = require('body-parser');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

mongoose.connect('mongodb+srv://vikas:vikas@crud-iyb9s.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
});

app.use(morgan('dev'));

app.use(body_parser.urlencoded({
    extended: false
}));
app.use(body_parser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header(
        "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
        return res.status(200).json({});
    }
    next();
})

app.use('/user',userRoutes);
app.use('/posts',postRoutes);

app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports = app;