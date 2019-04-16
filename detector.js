// Определение СОВ

const fs = require('fs');
const path = require('path');
const regExp = require('./regexp'); // ПРИЗНАКИ по которым определяется файл!!!
// Предполагается, что файл будет на сервере единственным (он был загружен ранее через форму на странице Обработка)
var pathToFile = ''; // путь к нужному файлу

// https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs/42734993#42734993
// Функция поиска файла в папке по расширению
function fromDir(startPath,filter){

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
			console.log('-- found: ',filename);
			pathToFile = filename;
        };
    };
};

fromDir(__dirname + '/public/uploads/','.log');
fromDir(__dirname + '/public/uploads/','.txt');
fromDir(__dirname + '/public/uploads/','.xml');
fromDir(__dirname + '/public/uploads/','.snlog');
console.log(pathToFile);

var ids = fs.readFileSync(pathToFile, 'utf-8'); // Открываем файл с сервера для его проверки
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

console.log('Detected = ' + detected);
module.exports = detected; 


// После всех манипуляций файл нужно удалить
fs.unlink(pathToFile, function(err){
	if (err) {
		console.log(err);
	} else {
		console.log('Delete file - ok');
	}
});
