const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const projects = require('./routes/api/projects')
const app = express();
const path = require('path')

//BodyParser Middleware
app.use(bodyParser.json())

//DB Congif
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db)
    .then(() => {
        console.log('MongoDB Connected')
    })
    .catch(err => console.log(err))


//Use routes
app.use('/api/projects', projects)


//Server static assets if in production

if(process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
//Run server
const port = process.env.PORT || 5000;
console.log(port)
app.listen(port, () => console.log(`Server Started on port ${port}`));
