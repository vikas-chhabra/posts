const mongoose = require('mongoose');

const user_model = ({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String, 
        default: null,
    },
    password: {
        type: String, 
        default: null,
    },
    token:{
        type: String,
        default: null,
    }
})

module.exports = mongoose.model('Users',user_model);