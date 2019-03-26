const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Posts = require('../models/user_posts');

router.post('/',(req,res,next)=>{
    let fromUser = req.body.from_user;
    let title = req.body.title;
    let description = req.body.description;

    Posts.find({fromUser:fromUser})
    .exec()
    .then(result=>{
        if(result.length<=0){
            const Post = new Posts ({
                _id : new mongoose.Types.ObjectId,
                fromUser:fromUser,
                title:title,
                description:description
            })
        
            Post.save()
            .then(result=>{
                res.status(201).json({
                    status:201,
                    message:'Post saved successfully',
                    result:result
                })
            })
            .catch(err=>{
                res.status(500).json({
                    status:500,
                    message:'Something went wrong while saving the post to the database',
                    error:err
                })
            })        
        }
        else{
            Posts.update({fromUser:result[0].fromUser},{$set:{title:title,description:description}})
            .then(result=>{
                res.status(201).json({
                    status:201,
                    message:'Post Updated successful',
                })
            })
            .catch(err=>{
                res.status(500).json({
                    status:500,
                    message:'Something went wrong while saving the post to the database',
                    error:err
                })
            })
        }
    })
})

router.get('/',(req,res,next)=>{
    Posts.find()
    .populate('fromUser',['name','email'])
    .exec()
    .then(PostsFromDatabase=>{
        res.status(200).json({
            status:200,
            posts:PostsFromDatabase,
            message:'Posts fetched successfully'
        })
    })
    .catch(err=>{
        res.status(500).json({
            status:500,
            message:"Something went wrong while getting the posts from the database",
            error:err
        })
    })
})

module.exports = router;