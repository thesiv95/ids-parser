
// Библиотеки
var express = require('express');
var app = express();
const mongoose = require('mongoose');

const twig = require('./node_modules/twig');
const bodyParser = require("body-parser");

// Самописные библиотеки и модули
const Pdfgen = require('./pdfgen');
var detected = require('./detector');

// порт для сервера express и параметры подключения к БД
var port = 3000;
var dbc = mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});

// Настройки шаблонизатора Twig
app.set('views', __dirname + '/views'); // папка с HTML-разметкой
app.set('view engine', 'twig');
app.set('twig options', { 
    strict_variables: false
});

// Папка для статических файлов (то есть стили css, скрипты js, и т.п.)
app.use(express.static('public'));

// Страницы
app.get('/', function(req, res){ // Главная
    res.render('index', {
        html_lang: 'ru',
        html_dir: 'ltr',
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
	    msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        title: 'Главная страница',
        header_parsing: 'Обработка',
        header_settings: 'Настройки',
        header_help: 'Справка'
    });
});

app.get('/parsing', function(req, res){
        const Snort = require('./snort').SnortRecord;
        // Вытаскиваем из БД информацию (переменная data), потом передаём эту информацию серверу, и он все выводит через twig
        // TODO: 1) Надо реализовать отправку файла через форму, а то сейчас передается только снорт (и то данные были занесены в базу вручную) - главное
        
        
        Snort.find().select().lean().exec(function(err, data){
            // console.log(data);
            res.render('parsing', {
                html_lang: 'ru',
                html_dir: 'ltr',
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
                data: data,
                ids_name: detected // переменная из библиотеки detector
            })
    });

});

// // ??? - обработка формы...
// app.post('/parse', function(req, res){
//     // console.log(jquery);
// });


app.get('/settings', function(req, res){
    // TODO: 3) реализовать изменение настроек - доп
    res.render('settings', {
        html_lang: 'ru',
        html_dir: 'ltr',
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
        msg_old_browser: 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.',
        msg_too_small: 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.',
        title: 'Страница не найдена!',
        go_back: 'Вернуться назад'
    })
});

// Вызов модуля PDFRender.js
app.get('/pdf', function(req, res){
    // Передаваемая информация
    var data = {
        title: 'IDS Parser Report',
        pieChart: 'pie.png', // TODO: придумать, как получить изображение
        text: ['str1 - good', 'str2 - good', 'str3 - bad', 'str4 - bad', 'str5 - bad', 'str6 - unknown'],
        traffic: {
            good: {
                quantity: 2,
                percent: 33
            },
            bad: {
                quantity: 3,
                percent: 50
            },
            unknown: {
                quantity: 1,
                percent: 16
            }
        },
        total: 6
    };
    // Главная и единственная функция в модуле
    Pdfgen.renderReport(data, res);
});


// ??? detector
app.post('/detector', function(req, res){
    console.log(req.file);
})


// Запуск сервера
app.listen(port, function () {
    console.log('Parser was started, using port ' + port);
    console.log('Home directory: ' + __dirname);
  });


// Когда все запущено, то нужно отключиться от БД, чтобы процесс приложения завершился
mongoose.disconnect();