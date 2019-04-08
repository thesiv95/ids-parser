
const mongoose = require('mongoose');
var dbc = mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});
console.log("connection ok");

//console.log();
// ВЫВЕСТИ ДАННЫЕ ИЗ БАЗЫ МАНГО)))))0)



// when all is done
mongoose.disconnect();