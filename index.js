// добавлены локализация и настройки, но
// есть проблемы с подключением к БД


// TODO: пофиксить загрузку настроек
// TODO: текст (достичь антиплагиата, мб поменять скрины, презентация, титульники и пр)

/***** Инициализация и настройка Приложения ******/

// Сторонние библиотеки
var express = require('express');
var app = express();
const helmet = require('helmet');
const xssFilter = require('x-xss-protection');
const nosniff = require('dont-sniff-mimetype');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
const twig = require('./node_modules/twig');
var upload = require('jquery-file-upload-middleware');
var bodyParser = require('body-parser');
app.use(bodyParser.json());



// Самописные библиотеки и модули
const Draw = require('./draw');
const Pdfgen = require('./pdfgen');

// порт для сервера express 
var port = 3000;

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

// переменная для модуля пдф
var draw = Draw; 

// { server: { 
//     // sets how many times to try reconnecting
//     reconnectTries: Number.MAX_VALUE,
//     // sets the delay between every retry (milliseconds)
//     reconnectInterval: 1000 
//     } 
// }

// Подключение к БД, для загрузки настроек
var eula, lang, styles;
mongoose.connect('mongodb://localhost:27017/config', { useNewUrlParser: true });

const setupSchema = new Schema({
    eula: Boolean,
    lang: String,
    styles: Number
});

const Setup = mongoose.model('Setup', setupSchema, 'setup');

// Наиболее приближенный к нужному вариант
// mongoose.connection.once('open', function(){
//     // Загрузка настроек
//     // !!! баг с получением данных из базы

//     //  MongoError: Topology was destroyed
//     Setup.find({_id :'5ccfaf5a0c3c1612d4e2c905'}, function(err, setting){
//         if (err) {
//             console.log('Setup Init error');
//             console.log(err);
//         } else {
//             console.log('Setup Contents');
//             if (setting){
//                 console.log(setting);
//                 eula = setting.eula;
//                 // if (setting.eula === null) eula = true;
//                 lang = setting.lang;
//                 styles = setting.styles;
//             } else {
//                 console.log('Setting is null');
//                 // console.log('База не загрузилась, берем изменения по умолчанию');
//                 // eula = true;
//                 // lang = 'en';
//                 // styles =1;
//             }

//         }

//     });

// }).on('error', function(e){
//     console.log('connection error!!! ' + e);
// });

mongoose.set('debug', true);

// Setup.findById('5ccfaf5a0c3c1612d4e2c905', function(err, setting){
//     if (err) {
//         console.log('Setup Init error');
//         console.log(err);
//     } else {
//         console.log('Setup Contents');
//         if (setting !== null || setting !== undefined){
//             console.log(setting[0]);
//             // eula = setting[0].eula;
//             // lang = setting[0].lang;
//             // styles = setting[0].styles;
//         } else {
//             console.log('Setting is null');
//         }
        
//     }

// });

// Setup.find({styles: 1}).exec(function(err, setting){
//         if (err) {
//             console.log('Setup Init error');
//             console.log(err);
//         } else {
//             console.log('Setup Contents');
//             if (setting !== null || setting !== undefined){
//                 console.log(setting[0]);
//                 eula = setting[0].eula;
//                 lang = setting[0].lang;
//                 styles = setting[0].styles;
//             } else {
//                 console.log('Setting is null/undefined');
//             }
            
//         }
    
//     });


console.log('Отключена загрузка из БД, пока проблема не решена');
eula = true;
lang = 'en';
styles = 1;

// Загрузка языковых файлов
var langFile = fs.readFileSync('lang/lang_' + lang + '.json');
console.log(lang);
var loadedLanguage = JSON.parse(langFile);

/***** Страницы ******/
// Лицензионное соглашение - по идее, должно загружаться в первый раз

app.get('/eula', function(req, res){
    res.render('eula', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_noscript,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        title: loadedLanguage.header_eula,
        eula_i_accept: loadedLanguage.eula_i_accept,
        eula_continue: loadedLanguage.eula_continue,
        styles: styles
    });
        
});

app.get('/', function(req, res){ // Главная

    // Если условия лиц. согл. не приняты - переброс на страницу eula
    if (!eula){
        
        // Обновляем значение в БД, чтобы потом редиректа не было
        Setup.findOneAndUpdate({eula: false}, {$set: {eula: true}}, function(err, res){
            if (err) console.log('Eula update error: ' + err);
        });
        res.redirect('/eula');
    } else {
        res.render('index', {
            // Элементы на странице
            html_lang: lang,
            html_dir: loadedLanguage.html_dir,
            msg_noscript: loadedLanguage.msg_noscript,
            msg_old_browser: loadedLanguage.msg_old_browser,
            msg_too_small: loadedLanguage.msg_too_small,
            title: loadedLanguage.header_main_page,
            header_parsing: loadedLanguage.header_parsing,
            header_settings: loadedLanguage.header_settings,
            header_help: loadedLanguage.header_help,
            // Какой стиль выбран?
            styles: styles
        });
    }
    
});


// Кнопка Начать Обработку
app.get('/extr123', function(req, res){
    
    var extractor = require('./extractor'); // именно сюда, иначе скрипт запускается сразу
    extractor.start();
    

});


app.get('/parsing', function(req, res){   
    res.render('parsing', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_noscript,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        title: loadedLanguage.header_parsing,
        btn_to_main_page: loadedLanguage.btn_to_main_page,
        btn_start_parsing: loadedLanguage.btn_start_parsing,
        btn_export_parsing: loadedLanguage.btn_export_parsing,
        parsing_ids_detected: loadedLanguage.parsing_ids_detected,
        parsing_report_download: loadedLanguage.parsing_report_download,
        parsing_timestamp: loadedLanguage.parsing_timestamp,
        parsing_signature: loadedLanguage.parsing_signature,
        parsing_legal: loadedLanguage.parsing_legal,
        parsing_illegal: loadedLanguage.parsing_illegal,
        parsing_unknown: loadedLanguage.parsing_unknown,
        parsing_conn_total: loadedLanguage.parsing_conn_total,
        parsing_date: loadedLanguage.parsing_date,
        draw: Draw, // объект с нужной информацией из модуля Draw.js
        // Какой стиль выбран?
        styles: styles
    });

});

app.get('/settings', function(req, res){
    
    res.render('settings', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_noscript,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        msg_changed: loadedLanguage.msg_changed,
        msg_settings_demo: loadedLanguage.msg_settings_demo,
        title: loadedLanguage.header_settings,
        settings_language: loadedLanguage.settings_language,
        settings_theme: loadedLanguage.settings_theme,
        btn_to_main_page: loadedLanguage.btn_to_main_page,
        btn_apply_settings: loadedLanguage.btn_apply_settings,
        // Какой стиль выбран?
        styles: styles
    });
});

app.get('/help', function(req, res){
    res.render('help', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_noscript,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        title: loadedLanguage.header_help,
        help_link_parsing: loadedLanguage.help_link_parsing,
        help_link_settings: loadedLanguage.help_link_settings,
        help_link_sysreq: loadedLanguage.help_link_sysreq,
        help_version: loadedLanguage.help_version,
        help_build_date: loadedLanguage.help_build_date,
        help_license: loadedLanguage.help_license,
        btn_to_main_page: loadedLanguage.btn_to_main_page,
        // Какой стиль выбран?
        styles: styles

    });
});

app.get('/author', function(req, res){
    res.render('author', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_noscript,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        title: loadedLanguage.header_author,
        author_email: loadedLanguage.author_email,
        author_facebook: loadedLanguage.author_facebook,
        author_twitter: loadedLanguage.author_twitter,
        author_github: loadedLanguage.author_github,
        author_vk: loadedLanguage.author_vk,
        author_diploma: loadedLanguage.author_diploma,
        btn_to_main_page: loadedLanguage.btn_to_main_page,
        // Какой стиль выбран?
        styles: styles
    })
});

// Любая другая неизвестная страница должна возвращать ошибку 404
app.get('*', function(req, res){
    res.render('404', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_noscript,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        title: loadedLanguage.header_404,
        go_back: loadedLanguage.go_back,
        // Какой стиль выбран?
        styles: styles
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

// Применение изменений в настройках
app.post("/applysettings", function(req,res){
    
    var setting = {};
    setting.lang = req.body.lang;
    setting.style = req.body.style;
    console.log('Settings applied');
    console.log(setting);

    Setup.findOneAndUpdate({_id: '5ccfaf5a0c3c1612d4e2c905'}, {$set: {lang: setting.lang, styles: setting.style}}, function(err){
        if (err) {
            console.log('Apply settings error');
            console.log(err);
        }
    });

  });


/***** Запуск сервера ******/
app.listen(port, function () {
    console.log('Parser was started, using port ' + port);
    console.log('Home directory: ' + __dirname);
  });


// Когда все запущено, то нужно отключиться от БД, чтобы процесс приложения завершился
mongoose.disconnect();