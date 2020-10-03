const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')


//connect to the MongoDb Atlas database.
mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', ()=>{
    console.log("Connected to Mongodb")
})

mongoose.connection.on('error', (err)=>{
    console.log("Error while connecting : ", err)
})

require('./models/user')
require('./models/post')

//express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json())   

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

//serve the static files (JS and CSS)
if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build')) 
    const path = require('path')
    //if client makes any get request, then send the index.html which contains the react code.
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })

}

//callback
app.listen(PORT, ()=>{
    console.log("Server is running on port ", PORT)
})

