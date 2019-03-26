const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/user_model');

router.post('/sign_up', (req, res, next) => {
    Users.find({
            email: req.body.email
        })
        .exec()
        .then(
            users => {
                if (users.length >= 1) {
                    return res.status(200).json({
                        status: 409,
                        message: 'email already exists',
                    })
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            res.status(500).json({
                                error: err,
                                message: 'something went wrong while encrtying the password'
                            })
                        } else {
                            const User = new Users({
                                _id: new mongoose.Types.ObjectId,
                                name: req.body.name,
                                password: hash,
                                email: req.body.email
                            })
                            User.save()
                                .then(result => {
                                    res.status(201).json({
                                        status: 201,
                                        message: 'signUp successful',
                                        createdUser: result
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        status: 500,
                                        message: 'Something went wrong please try after some time(Saving user to the database)',
                                        error: err
                                    })
                                })
                        }
                    })
                }
            }
        )
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: 'Something went wrong while finding the user from the database',
                error: err
            })
        })
})

router.post('/login', (req, res, next) => {
    Users.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length <= 0) {
                res.status(404).json({
                    status: 404,
                    message: 'email does not exists ',
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: 'authentication fails due to some error',
                            error: err
                        })
                    } else {
                        if (result === true) {
                            const token = jwt.sign({
                                    email: user[0].email,
                                    user_id: user[0]._id
                                },
                                'SECRET', {
                                    expiresIn: '1h'
                                }
                            )
                            Users.updateOne({
                                    _id: user[0]._id
                                }, {
                                    $set: {
                                        token: token
                                    }
                                })
                                .exec()
                                .then(result => {
                                    res.status(200).json({
                                        status: 200,
                                        token: token,
                                        user_id: user[0].id
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        status: 500,
                                        message: 'something went wrong while updating token to the database',
                                        error: err
                                    })
                                })
                        } else {
                            res.status(200).json({
                                status: 404,
                                message: 'Email/Password Wrong'
                            })
                        }
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: 'Something went wrong while fetching the users from database',
                error: err
            })
        })
})

router.post('/token_verify',(req,res,next)=>{
    Users.find({$and:[{token:req.body.token},{_id:req.body.user_id}]})
    .exec()
    .then(
        users=>{
            if(users.length===1){
                return res.status(200).json({
                    status:200,
                    result: true
                })
            }
            else{
                return res.status(200).json({
                    status:404,
                    result: false
                })
            }
        }
    )
    .catch(
        err=>{
            return res.status(500).json({
                status:500,
                message:"Something happend wrong while finding the access token",
                error:err
            });
        }
    )
});


router.get('/', (req, res, next) => {
    Users.find()
    
    .exec()
    .then(result=>{
        if(result){
            res.status(200).json({
                status: 200,
                users:result
            })
        }
        else{
            res.status(404).json({
                status: 404,
                message: 'Users Not Found'
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            status: 500,
            message: 'SOmething went wrong while fetching users from database',
            error: err
        })
    })
})

module.exports = router;