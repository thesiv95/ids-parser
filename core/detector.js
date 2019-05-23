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
        console.log("Directory not found: ",startPath);
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
			// console.log('-- found: ',filename);
			pathToFile = filename;
        };
    };
};

// Переменная __dirname включает в себя папку core, нужно убрать
var oneDirBack = __dirname.slice(0, __dirname.indexOf('/core'));

fromDir(oneDirBack + '/public/uploads/','.log');
fromDir(oneDirBack + '/public/uploads/','.txt');
fromDir(oneDirBack + '/public/uploads/','.xml');
fromDir(oneDirBack + '/public/uploads/','.snlog');
// console.log(pathToFile);
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

// console.log('Detected = ' + detected);



module.exports = {
	detected: detected,
	pathToFile: pathToFile
}; // далее подключим к библиотеке extractor.js, и библиотекам-"расщепителям"

// fs.close();

// После всех манипуляций файл нужно удалить - пока что уберем эту функцию
// Отдельная функция, а то удаление запускается до того, как сработали все остальные скрипты, и из-за этого возникает ошибка
// deleteFile(pathToFile);

// function deleteFile(pathToFile){
//     fs.unlink(pathToFile, function(err){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('Delete file - ok');
//         }
//     });
// }

