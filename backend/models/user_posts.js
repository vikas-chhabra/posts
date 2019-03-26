const mongoose = require('mongoose');

const user_posts = ({
    _id: mongoose.Schema.Types.ObjectId,
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    },
    title: {
        type: String, 
        default: null
    },
    description: {
        type: String, 
        default: null
    }
})

module.exports = mongoose.model('Posts',user_posts);