const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')  //restructuring from json.
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

//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




//default route
router.get('/', (req, res) => {
    res.send("Hello!")
})

router.post('/signup', (req, res) => {
    console.log(req.body)
    const { name, email, password, pic } = req.body

    if (!email || !password || !name) {
        return res.status(422).json({
            error: "Please add all the mandatory fields (Name, Email and Password)!"
        })
    }

    /*
    collection.findOne()
    Return a single document from a collection or view. 
    If multiple documents satisfy the query, 
    this method returns the first document according to the query’s sort order or natural order.
    */

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    error: "User already exists with that email!"
                })
            }

            //hash the password to store in db.
            bcrypt.hash(password, 12)    
                .then(hashedpassword => {

                    //create the user document.
                    const user = new User({
                        email,
                        name,
                        password: hashedpassword,
                        pic: pic
                    })

                    //save the document to the database.
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "sneha.herle@gmail.com",
                                subject: "Signed Up Successfully",
                                html: "<h1>Welcome!</h1>"
                            })
                            res.json({
                                message: "Saved successfully!"
                            })
                        })
                        .catch(err => {
                            console.log("Error while saving to MongoDB : ", err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req,res) => {

    const {email, password} = req.body

    if (!email || !password){
        res.status(422).json({error: "Please add email or password."})
    }

    User.findOne({email:email})
        .then(savedUser => {
            if(!savedUser){
                return res.status(422).json({error: "Invalid email or password."})
            }

            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        //res.json({message: "Successfully signed in!"})
                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                        const {_id, name, email, followers, following, pic} = savedUser
                        res.json({token: token, user: {_id, name, email, followers, following, pic}})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password."})
                    }
                }) 
                .catch(err => {
                    console.log(err)
                })    
        })

})

/*
router.get('/protected', requireLogin, (req,res) => {
    res.send("Hello User!")
})
*/

module.exports = router