const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 
require("dotenv").config();

const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    connectTimeoutMS: 60000
  }

mongoose.connect(process.env.DB_ACCESS, options)
  .then(function () { 
    console.log('Base de datos conectada!'); 
  }).catch(function (err) { 
    console.log(err.message); 
  }); 

module.exports = mongoose.connection;