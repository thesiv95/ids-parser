// Прописать функцию, которая бы читала файл с формы, и определяла, что за СОВ
// (мб) подключить все файлы .js, так как модуль-экспорт там прописан везде
// не понятно, нужен или нет extractor.js (проще их объединить)


const fs = require('fs');
const regExp = require('./regexp'); // ПРИЗНАКИ по которым определяется файл!!!
var ids = '' // типа сюда должен попасть этот признак))
// const bodyParser = require("body-parser");
var detected = ''; // результат определения

if (ids.match(regExp.detectionBro)) {
	detected = 'Bro';
} else if (ids.match(regExp.detectionDallasLock)) {
	detected = 'Dallas Lock';
} else if (ids.match(regExp.detectionSecretNet)) {
	detected = 'SecretNet';
} else if (ids.match(regExp.detectionSnort)) {
	detected = 'Snort';
} else if (ids.match(regExp.detectionSuricata)){
	detected = 'Suricata';
} else {
	detected = '?';
}


module.exports = detected; 


// https://github.com/expressjs/multer/blob/master/doc/README-ru.md
