const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});
console.log("connection ok");




// when all is done
mongoose.disconnect();