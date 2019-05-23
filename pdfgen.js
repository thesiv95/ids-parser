const PDFDocument = require('pdfkit'); // библиотека для генерации PDF
const moment = require('moment'); // библиотека для форматирования даты и времени
const doc = new PDFDocument; // кэш библиотеки для генерации PDF
const SVGtoPDF = require('svg-to-pdfkit'); // библиотека для отрисовки графики в pdfkit
const fs = require('fs'); // файловая система node.js

// Короткая запись функции svg, чтобы проще было использовать внутри метода
PDFDocument.prototype.addSVG = function(svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
};

// doc.addSVG(svg, x, y, options);


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

        // Диаграмма 1
        // Попытка воспользоваться графической SVG библиотекой

        var svgObject = {
            x: 65,
            y: 125
        }

        var svgOptions = null;

        var svg = '<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393.13 393.38"><path d="M265,255H68.56C68.56,146.51,156.51,58.56,265,58.56h0Z" transform="translate(-68.31 -58.31)" style="fill:#489fca;stroke:#000;stroke-miterlimit:10;stroke-width:0.5px"/><path d="M265,255V451.44C156.51,451.44,68.56,363.49,68.56,255H265Z" transform="translate(-68.31 -58.31)" style="fill:#51c123;stroke:#000;stroke-miterlimit:10;stroke-width:0.5px"/><path d="M265,255V58.56c108.49,0,196.44,87.95,196.44,196.44S373.49,451.44,265,451.44h0Z" transform="translate(-68.31 -58.31)" style="fill:#da4e0a"/></svg>';
       
        doc.addSVG(svg, svgObject.x, svgObject.y, svgOptions);

        // Диаграмма 2
        // ПРИМЕЧАНИЕ. Тут показан ПРИМЕР того, где должна быть диаграмма. Она 
        // (пока что) не отрисовывается согласно реальным значением трафика 
        // (только какой-то один цвет), т.к. пока 
        // непонятно, как сие реализовать...(см. выше)
        // doc.circle(125, 185, 50)   // задали параметры круга
        //     .lineWidth(0)          // нет границы (или минимальное значение границы)
        //     .fillOpacity(1)        // непрозрачный
        //     .fillAndStroke(data.pieColor, "transparent") // цвет заливки, цвет границы
        //     .stroke()              // нарисовали круг
        //     // Обратно переключимся на черный цвет для текста
        //     .fill("black");
        // // Да, пришлось вот так вот извратиться, потому что блин это векторная графика
        // // И все остальные элементы налазят на эту графику. FFFFFUUUUU!!!!
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        
        // Список записей
        // doc.fill(data.pieColor);
        // Цвета соответствуют значениям классов CSS, который задает цвет надписей в браузере
        for (var i = 0; i < data.text.length; i++){
            if (data.text[i].indexOf('good') !== -1) {
                doc.fill("#51c123");
                doc.text(" • " + data.text[i]);
           } else if (data.text[i].indexOf('bad') !== -1) {
                doc.fill("#da4e0a");
                doc.text(" • " + data.text[i]);
            } else { // unknown
                doc.fill("#489fca");
                doc.text(" • " + data.text[i]);
            }
        }


        // doc.list(data.text); // массив выведется как маркированный список (классная функция, но она не справляется с конкретным значением массива)
        doc.text('\n');
        doc.fill("black");
        // Информация о типах трафика
        doc.text('Traffic information:\n');
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
        //res.end(); // закрытие подключения
    }
}

module.exports = Pdfgen;