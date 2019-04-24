// Сторонние библиотеки
var express = require('express');
var app = express();
const helmet = require('helmet');
const xssFilter = require('x-xss-protection');
const nosniff = require('dont-sniff-mimetype');
//const mongoose = require('mongoose');
const twig = require('./node_modules/twig');
var upload = require('jquery-file-upload-middleware');
// var extractor = require('./extractor'); 

// Самописные библиотеки и модули
const Draw = require('./draw');
const Pdfgen = require('./pdfgen');


// порт для сервера express 
var port = 3000;
// var dbc = mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});

// Настройки шаблонизатора Twig
app.set('views', __dirname + '/views'); // папка с HTML-разметкой
app.set('view engine', 'twig');
app.set('twig options', { 
    strict_variables: false
});

// Папка для статических файлов (то есть стили css, скрипты js, и т.п.)
app.use(express.static('public'));

// Безопасные заголовки
app.use(helmet());
app.use(xssFilter());
app.use(nosniff());


var draw = Draw; // переменная для модуля пдф
console.log("kek lal " + draw.time_reg);



// Страницы
app.get('/', function(req, res){ // Главная
    
    res.render('index', {
        html_lang: 'ru',
        html_dir: 'ltr',
        msg_noscript: 'Пожалуйста, включите JavaScript в вашем браузере!',
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
	    msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        title: 'Главная страница',
        header_parsing: 'Обработка',
        header_settings: 'Настройки',
        header_help: 'Справка'
    });
});


// Кнопка Начать Обработку
app.get('/extr123', function(req, res){
    
    var extractor = require('./extractor'); // именно сюда, иначе скрипт запускается сразу
    extractor.start();
    

});

// TODO: реализовать модуль draw.js


app.get('/parsing', function(req, res){
    
    res.render('parsing', {
        html_lang: 'ru',
        html_dir: 'ltr',
        msg_no_script: 'Пожалуйста, включите JavaScript в вашем браузере!',
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
        msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        title: 'Обработка',
        btn_to_main_page: 'На главную страницу',
        btn_start_parsing: 'Начать обработку',
        btn_export_parsing: 'Экспортировать результат',
        parsing_ids_detected: 'Распознанная СОВ',
        parsing_report_download: 'Скачать в формате PDF',
        parsing_timestamp: 'в',
        parsing_signature: 'Сигнатура',
        parsing_legal: 'Легитимный',
        parsing_illegal: 'Нелегитимный',
        parsing_unknown: 'Неопределённый',
        parsing_conn_total: 'Всего записей в журнале',
        parsing_date: 'Дата обработки',
        draw: Draw // объект с нужной информацией из модуля Draw.js
    });

});

app.get('/settings', function(req, res){
    // TODO: 3) реализовать изменение настроек - доп
    res.render('settings', {
        html_lang: 'ru',
        html_dir: 'ltr',
        msg_no_script: 'Пожалуйста, включите JavaScript в вашем браузере!',
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
        msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        msg_changed: 'Изменения успешно сохранены!',
        title: 'Настройки',
        settings_language: 'Язык (Language)',
        settings_theme: 'Тема оформления',
        btn_to_main_page: 'На главную страницу',
	    btn_apply_settings: 'Применить'
    });
});

app.get('/help', function(req, res){
    res.render('help', {
        html_lang: 'ru',
        html_dir: 'ltr',
        msg_no_script: 'Пожалуйста, включите JavaScript в вашем браузере!',
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
        msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        title: 'Справка',
        help_link_parsing: 'Раздел &quot;Обработка&quot;',
        help_link_settings: 'Раздел &quot;Настройки&quot;',
        help_version: 'Версия программы',
        help_build_date: 'Дата сборки',
        help_license: 'Лицензия',
        btn_to_main_page: 'На главную страницу'

    });
});

app.get('/author', function(req, res){
    res.render('author', {
        html_lang: 'ru',
        html_dir: 'ltr',
        msg_no_script: 'Пожалуйста, включите JavaScript в вашем браузере!',
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
        msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        title: 'Об авторе',
        author_email: 'Электронная почта',
        author_facebook: 'Facebook',
        author_twitter: 'Twitter',
        author_github: 'Github',
        author_vk: 'ВКонтакте',
        author_diploma: 'Данный проект является дипломной работой для НГТУ',
        btn_to_main_page: 'На главную страницу'
    })
});

app.get('/404', function(req, res){
    res.render('404', {
        html_lang: 'ru',
        html_dir: 'ltr',
        msg_no_script: 'Пожалуйста, включите JavaScript в вашем браузере!',
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
        msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        title: 'Страница не найдена!',
        go_back: 'Вернуться назад'
    })
});

// Вызов модуля PDFRender.js
app.get('/pdf', function(req, res){
    // Подсчет некоторой информации перед ее передачей
    // Воспользуемся объектом draw (инфа, полученная из БД)
    var textString = draw.ip_src + ':' + draw.port_src + '->' + draw.ip_dest + ':' + draw.port_dest + ' [' + draw.protocol + '] at ' + draw.date_reg + ' ' + draw.time_reg + ' - ' + draw.conn_quantity + ' ' + draw.signatures + ' - ' + draw.status;
    var textStringArray = [];
    for (var i = 0; i < draw.conn_quantity; i++){
        textStringArray.push(textString);
    }
    var goodTraffic = 0, badTraffic = 0, unknownTraffic = 0;
    for (var i = 0; i < textStringArray.length; i++){
        if (textStringArray[i].indexOf('good') !== -1) {
            goodTraffic++;
        } else if (textStringArray[i].indexOf('bad') !== -1) {
            badTraffic++;
        } else {
            unknownTraffic++;
        }
    }
    // Передаваемая информация
    var data = {
        title: 'IDS Parser Report',
        ids_name: draw.ids_name,
        text: textStringArray,
        traffic: {
            good: {
                quantity: goodTraffic,
                percent: parseInt(goodTraffic / draw.conn_quantity * 100)
            },
            bad: {
                quantity: badTraffic,
                percent: parseInt(badTraffic / draw.conn_quantity * 100)
            },
            unknown: {
                quantity: unknownTraffic,
                percent: parseInt(unknownTraffic / draw.conn_quantity * 100)
            }
        },
        total: draw.conn_quantity
    };
    // Главная и единственная функция в модуле
    Pdfgen.renderReport(data, res);
});
   
// Загрузка файла на сервер
upload.configure({
    uploadDir: __dirname + '/public/uploads', // куда сохранять
    uploadUrl: '/uploads' // какая ссылка
});
 
// Если не пост запрос, то возвращаемся на ту же страницу (т.е.ничего не делаем)
app.get('/upload', function( req, res ){
    res.redirect('/parsing');
});
 
app.put('/upload', function( req, res ){
    res.redirect('/parsing');
});
 
app.delete('/upload', function( req, res ){
    res.redirect('/parsing');
});
 
app.use('/upload', function(req, res, next){ // ссылка для загрузки
    upload.fileHandler({
        uploadDir: function () {
            return __dirname + '/public/uploads/'
        },
        uploadUrl: function () {
            return '/uploads'
        }
    })(req, res, next);
});

// Запуск сервера
app.listen(port, function () {
    console.log('Parser was started, using port ' + port);
    console.log('Home directory: ' + __dirname);
  });


// Когда все запущено, то нужно отключиться от БД, чтобы процесс приложения завершился
// mongoose.disconnect();