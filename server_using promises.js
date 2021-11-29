// do  init to setup package.json
// npm init --yes


// bring in express framework into server
// npm install -s express

// to use body from posts need to install  body-parser
// npm install -s body-parser

// to use socket.io need to install
// npm install -s socket.io




var express = require("express")
var bodyParser = require("body-parser")
var app = express()

// needed for socket.io to express connection
var http = require('http').Server(app)
var io = require('socket.io')(http)


// to use mongoose to connect to mongo db need to install
// npm install -s mongoose
var mongoose = require('mongoose')




app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl="mongodb+srv://user:user@cluster0.ytqgr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

var MessageModel=mongoose.model('Message',{
    name:String,
    message:String
})


app.get('/messages',(req,res) => {
    MessageModel.find({},(err,messages) => {
        res.send(messages)
    })
})


app.post('/messages', (req, res) =>{
    // to use body from posts need to install  body-parser
    // npm install -s body-parser
    var message = new MessageModel(req.body)

//    message.save((err) => {
//        if (err) sendStatus(500)
//
//        io.emit('message',req.body)
//        res.sendStatus(200)
//    })
    message.save()
    .then(() =>{
        console.log('saved message')
        return MessageModel.findOne({message:'badword'})
    })
    .then( censored =>{
        if (censored){
            console.log("found bad word: ",censored)
            return MessageModel.remove({_id: censored.id})   
        }
        io.emit('message',req.body)
        res.sendStatus(200)
    })
    .catch((err) =>{
        res.sendStatus(500)
        return console.error(err)
    })
})

io.on('connection',(socket) =>{
    console.log("a new user connected....")
})

mongoose.connect(dbUrl,(err) =>{
    console.log("mongo db connection -- err=",err)
})

var server = http.listen(3000,() =>{
    console.log("server is listening on port ",server.address().port)
})