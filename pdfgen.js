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
        // doc.fontSize(14);
        // doc.text(data.title, { // заголовок
        //     align: 'center',
        //     underline: true
        // });
        // doc.text('\n'); // пустая строка между элементами

        

        doc.fontSize(14);
        doc.text(data.title, { // заголовок
            align: 'center',
            underline: true
        });
        doc.text('\n'); // пустая строка между элементами
        doc.text('IDS detected: ' + data.ids_name);
        doc.text('\n');
        // Диаграмма
        // ПРИМЕЧАНИЕ. Тут показан ПРИМЕР того, где должна быть диаграмма. Она 
        // (пока что) не отрисовывается согласно реальным значением трафика, т.к. пока 
        // непонятно, как сие реализовать...
        doc.circle(125, 185, 50)   // задали параметры круга
            .lineWidth(0)          // нет границы (или минимальное значение границы)
            .fillOpacity(1)        // непрозрачный
            .fillAndStroke("#da4e0a", "transparent") // цвет заливки, цвет границы
            .stroke()              // нарисовали круг
            // Обратно переключимся на черный цвет для текста
            .fill("black");
        // Да, пришлось вот так вот извратиться, потому что блин это векторная графика
        // И все остальные элементы налазят на эту графику. FFFFFUUUUU!!!!
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        // Список записей
        doc.fill("#da4e0a");
        doc.list(data.text); // массив выведется как маркированный список
        doc.text('\n');
        doc.fill("black");
        // Информация о типах трафика
        doc.text('Traffic information:\n');
        // Цвета соответствуют значениям классов CSS, который задает цвет надписей в браузере
        doc.fill("#51c123");
        doc.text('Legal: ' + data.traffic.good.quantity + ' (' + data.traffic.good.percent + '%)\n');
        doc.fill("#da4e0a");
        doc.text('Illegal: ' + data.traffic.bad.quantity + ' (' + data.traffic.bad.percent + '%)\n');
        doc.fill("#489fca");
        doc.text('Unknown: ' + data.traffic.unknown.quantity + ' (' + data.traffic.unknown.percent + '%)\n');
        doc.fill("black");
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