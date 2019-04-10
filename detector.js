// Прописать функцию, которая бы читала файл с формы, и определяла, что за СОВ
// (мб) подключить все файлы .js, так как модуль-экспорт там прописан везде
// не понятно, нужен или нет extractor.js (проще их объединить)


// ПРИЗНАКИ по которым определяется файл!!!
var regExp = require('./regexp');

var ids = ''; // типа сюда должен попасть этот признак))

ids = '<Журнал>';

var detected = ''; // результат определения


switch(ids){  // не торт
	
	case ids.match(regExp.detectionBro):
		detected = 'Bro';
	case ids.match(regExp.detectionSnort):
		detected = 'Snort';
	case ids.match(regExp.detectionDallasLock):
		detected = 'Dallas Lock';
	default:
	console.log(ids);
		detected = 'unknown';
}

console.log(detected);
module.exports = detected; 
