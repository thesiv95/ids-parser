// PDFRender Module

const PDFDocument = require('pdfkit'); // библиотека для генерации PDF
const moment = require('moment'); // библиотека для форматирования даты и времени
const doc = new PDFDocument; // кэш библиотеки для генерации PDF
const SVGtoPDF = require('svg-to-pdfkit'); // библиотека для отрисовки графики в pdfkit
const fs = require('fs'); // файловая система node.js

// Короткая запись функции SVGtoPDF, чтобы проще было использовать внутри функции renderReport
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
        // Цвета соответствуют значениям классов CSS, который задает цвет надписей в браузере
        // !!! Расчет пока что не точен на 100%
        // Информация для плагина svg-to-pdfkit
        
        var svg = ''; // сюда и поместим всю диаграмму
        // В зависимости от количества строк с типами трафиков, отрисовывается нужный график
        var svgTraffic = {
            good: 0,
            bad: 0,
            unknown: 0
        };

        for (var i = 0; i < data.text.length; i++){
            if (data.text[i].indexOf('good') !== -1) {
                svgTraffic.good++;
           } else if (data.text[i].indexOf('bad') !== -1) {
                svgTraffic.bad++;
            } else { // unknown
                svgTraffic.unknown++;
            }
        }

        // Если пойман только один тип трафика, рисуем целый круг с соответствующим цветом
        // Если несколько - то рисуем диаграмму из 3 цветов (но над самой диаграммой надо еще пахать)

        var svgParams = {
            // Значения заданы в порядке расположения тегов <path> в диаграмме
            pathBlue: 265,
			pathGreen: 265,
			pathRed: 264
        };


        if (svgTraffic.bad >= 1 && svgTraffic.good === 0 && svgTraffic.unknown === 0){
            svg = '<svg width="400" height="400" viewBox="0 0 210 297"><ellipse style="opacity:1;fill:#da4e0a;fill-opacity:1;fill-rule:evenodd;stroke-width:0.26458332;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" cx="30" cy="50" rx="50" ry="50" /></svg>';
        } else if (svgTraffic.bad === 0 && svgTraffic.good >= 1 && svgTraffic.unknown === 0){
            svg = '<svg width="400" height="400" viewBox="0 0 210 297"><ellipse style="opacity:1;fill:#51c123;fill-opacity:1;fill-rule:evenodd;stroke-width:0.26458332;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" cx="30" cy="50" rx="50" ry="50" /></svg>';
        } 
        else if (svgTraffic.bad === 0 && svgTraffic.good === 0 && svgTraffic.unknown >= 1) {
            svg = '<svg width="400" height="400" viewBox="0 0 210 297"><ellipse style="opacity:1;fill:#489fca;fill-opacity:1;fill-rule:evenodd;stroke-width:0.26458332;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" cx="30" cy="50" rx="50" ry="50" /></svg>';
        } else {
            svg = '<svg width="150" height="150" viewBox="0 0 393.13 393.38"><path d="M265,255H68.56C68.56,146.51,156.51,58.56,'+ svgParams.pathBlue +',58.56h0Z" transform="translate(-68.31 -58.31)" style="fill:#489fca;stroke-width:0"/><path d="M' + svgParams.pathGreen + ',258V451.44C156.51,451.44,68.56,363.49,68.56,255H265Z" transform="translate(-68.31 -58.31)" style="fill:#51c123;stroke-width:0"/><path d="M265,255V58.56c108.49,0,196.44,87.95,196.44,196.44S373.49,451.44,' + svgParams.pathRed + ',451.44h0Z" transform="translate(-68.31 -58.31)" style="fill:#da4e0a;stroke-width:0"/></svg>';
        }

        // Задаем расположение диаграммы
        var svgPlace = {
            x: 55,
            y: 125
        };
        // Доп. настроек плагину не задаем
        var svgOptions = null;
        // Отрисовываем
        doc.addSVG(svg, svgPlace.x, svgPlace.y, svgOptions);
       
        // Да, пришлось вот так вот извратиться, потому что блин это векторная графика
        // И все остальные элементы налазят на эту графику. FFFFFUUUUU!!!!
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        doc.text('\n');
        
        // Список записей
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


        // doc.list(data.text); - массив выведется как маркированный список (классная функция,
        // но она не справляется с конкретным значением массива)
        doc.text('\n');
        doc.fill("black");
        // Информация о типах трафика - с указанием нужных цветов текста
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
        // Указываем, когда создан файл
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