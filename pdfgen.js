const PDFDocument = require('pdfkit'); // библиотека для генерации PDF
const moment = require('moment'); // библиотека для форматирования даты и времени
const doc = new PDFDocument; // кэш библиотеки для генерации PDF
const fs = require('fs'); // файловая система node.js

var Pdfgen = {
    renderReport: function(data, res){
        /* Создание файла, открытие для записи */
        var datetimeString = moment().format('DD-MM-YYYY__hh_mm_ss_a');
        var myFilename = 'output_-_' + datetimeString;
        doc.pipe(fs.createWriteStream(myFilename + '.pdf'));
        doc.pipe(res);  // HTTP-заголовки сервера Express
       
        /* Добавление содержимого */
        doc.fontSize(14);
        doc.text(data.title, { // заголовок
            align: 'center',
            underline: true
        });
        doc.text('\n'); // пустая строка между элементами
        doc.text('IDS detected: ' + data.ids_name);
        doc.text('\n');
        // Список записей
        doc.list(data.text); // массив выведется как маркированный список
        doc.text('\n');
        // Информация о типах трафика
        doc.text('Traffic information:\n');
        doc.text('Legal: ' + data.traffic.good.quantity + ' (' + data.traffic.good.percent + '%)\n');
        doc.text('Illegal: ' + data.traffic.bad.quantity + ' (' + data.traffic.bad.percent + '%)\n');
        doc.text('Unknown: ' + data.traffic.unknown.quantity + ' (' + data.traffic.unknown.percent + '%)\n');
        doc.text('Total entries: ' + data.total);
        doc.text('\n');
        // когда создан
        var currentDatetime = moment().format('MMMM Do YYYY, h:mm a');
        doc.fontSize(14);
        doc.text('Report was generated at ' + currentDatetime, {
            align: 'center',
            fill: true
        });

        /* Завершение создания документа */
        doc.end(); 
    }
}

module.exports = Pdfgen;