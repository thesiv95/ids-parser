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
            x: 125,
            y: 185
        }

        var svgOptions = null;

        var svg = '<svg width="400mm" height="400mm"><g><ellipse style="fill:' + data.pieColor +';fill-rule:evenodd;stroke-width:0.26458332" cx="44.034225" cy="41.299107" rx="31.561012" ry="30.805059" /><path style="fill:none;stroke-width:1.42857146" d="M 148.29221,270.71992 C 123.93151,266.84753 102.0386,255.84479 83.510715,238.1626 67.687861,223.06199 57.718066,206.47873 51.611171,185.1025 47.089331,169.27452 47.086626,142.94482 51.605195,126.93902 70.768961,59.05658 143.10431,23.458769 210.57927,48.704387 c 33.10445,12.385962 61.21264,43.584342 70.87058,78.662033 4.02402,14.61523 3.6117,45.90849 -0.79054,60 -12.30172,39.3775 -42.17896,68.6268 -81.78209,80.06324 -10.47297,3.02434 -40.12479,4.95302 -50.58501,3.29026 z" /></g></svg>';
        
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