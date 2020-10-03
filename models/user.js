const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/cloud29sep20/image/upload/v1601737259/1_W35QUSvGpcLuxPo3SRTH4w_je3fct.png"
    },
    followers : [{
        type: ObjectId,
        ref: "User"
    }],
    following : [{
        type: ObjectId,
        ref: "User"
    }]
})

mongoose.model("User", userSchema)  //name of the model is User