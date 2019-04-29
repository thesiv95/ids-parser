// добавлены локализация и настройки, но
// есть проблемы с подключением к БД


/***** Инициализация и настройка Приложения ******/

// Сторонние библиотеки
var express = require('express');
var app = express();
const helmet = require('helmet');
const xssFilter = require('x-xss-protection');
const nosniff = require('dont-sniff-mimetype');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const twig = require('./node_modules/twig');
var upload = require('jquery-file-upload-middleware');

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

// Подключение к БД, для загрузки настроек
mongoose.connect('mongodb://localhost:27017/config', {useNewUrlParser: true});
const setupSchema = new Schema({
    eula: Boolean,
    lang: String,
    styles: Number
});

const Setup = mongoose.model('Setup', setupSchema, 'setup');
var eula, lang, styles;
Setup.findById('5caee5c4e4f44decbda7fad7', function(err, res){
    if (err) {
        console.log('Setup DB connection error: ' + err);
        return;
    }
    // нужно получить res.styles
    // styles = res.styles;
    
    // Почему то res не всегда возвращает то что должен
    // Пока что напишу такую заглушку
    if (res === null) {
        // eula = false;
        eula = true;
        lang = 'be';
        styles = 1;
    } else {
        console.log('База загрузилась');
        eula = res.eula;
        lang = res.lang;
        styles = res.styles;
    }

    console.log('Setup Result');
    console.log(eula + ' ' + lang + ' ' + styles);
        
    //mongoose.disconnect(); 
});

// Загружаем языковые константы
const langSchema = new Schema({
    ru: Object,
    en: Object,
    he: Object,
    uk: Object,
    be: Object
});

var loadedLanguage = {}; // загруженный, текущий язык, его передаем в шаблонизатор
const Lang = mongoose.model('Lang', langSchema, 'lang');

Lang.findById('5caef23ce4f44decbda7fc2e', function(err, res){
    if (err) {
        console.log('Language load error: ' + err);
    }
    console.log('Language Result');
    console.log(res);


    // Заглушка
    // Добавить подгрузку нужного языка

    if (res === null) {
        if(lang == 'ru'){
            loadedLanguage.html_dir = 'ltr';
            loadedLanguage.msg_changed = 'Изменения успешно сохранены!';
            loadedLanguage.msg_noscript = 'Пожалуйста, включите JavaScript в вашем браузере!';
            loadedLanguage.msg_old_browser = 'Этот браузер поддерживает не все технологии, которые использует программа. Программа может работать, но с перебоями. Настоятельно рекомендуется использовать браузер, указанный в инструкции, во избежание возникновения проблем. Инструкция находится в разделе &quot;Справка&quot;.';
            loadedLanguage.msg_too_small = 'Размер ширины окна слишком мал, чтобы отобразить результат обработки данных. Если вы используете мобильное устройство, измените ориентацию экрана на альбомную.';
            loadedLanguage.header_eula = 'Лицензионное соглашение';
            loadedLanguage.header_main_page = 'Главная страница';
            loadedLanguage.header_parsing = 'Обработка';
            loadedLanguage.header_settings = 'Настройки';
            loadedLanguage.header_help = 'Справка';
            loadedLanguage.header_author = 'Об авторе';
            loadedLanguage.header_404 = 'Страница не найдена';
            loadedLanguage.eula_i_accept = 'Я принимаю условия соглашения';
            loadedLanguage.eula_continue = 'Продолжить';
            loadedLanguage.btn_to_main_page = 'На главную страницу';
            loadedLanguage.btn_start_parsing = 'Начать обработку';
            loadedLanguage.btn_export_parsing = 'Экспортировать результат';
            loadedLanguage.parsing_ids_detected = 'Распознанная СОВ';
            loadedLanguage.parsing_report_download = 'Скачать в формате PDF';
            loadedLanguage.parsing_timestamp = 'в';
            loadedLanguage.parsing_signature = 'Сигнатура';
            loadedLanguage.parsing_legal = 'Легитимный';
            loadedLanguage.parsing_illegal = 'Нелегитимный';
            loadedLanguage.parsing_unknown = 'Неопределённый';
            loadedLanguage.parsing_conn_total = 'Всего записей в журнале';
            loadedLanguage.parsing_date = 'Дата обработки';
            loadedLanguage.settings_language = 'Язык (Language)';
            loadedLanguage.settings_theme = 'Тема оформления';
            loadedLanguage.btn_to_main_page = 'На главную страницу';
            loadedLanguage.btn_apply_settings = 'Применить';
            loadedLanguage.help_link_parsing = 'Раздел &quot;Обработка&quot;';
            loadedLanguage.help_link_settings = 'Раздел &quot;Настройки&quot;';
            loadedLanguage.help_version = 'Версия программы';
            loadedLanguage.help_build_date = 'Дата сборки';
            loadedLanguage.help_license = 'Лицензия';
            loadedLanguage.author_email = 'Электронная почта';
            loadedLanguage.author_facebook = 'Facebook';
            loadedLanguage.author_twitter = 'Twitter';
            loadedLanguage.author_github = 'Github';
            loadedLanguage.author_vk = 'ВКонтакте';
            loadedLanguage.author_diploma = 'Данный проект является дипломной работой для НГТУ';
            loadedLanguage.go_back = 'Вернуться назад';
        } else if (lang == 'en') {
            loadedLanguage.html_dir = "ltr";
            loadedLanguage.header_main_page = "Main page";
            loadedLanguage.header_eula = "End-User License Agreement";
            loadedLanguage.header_parsing = "Parsing";
            loadedLanguage.header_settings = "Settings";
            loadedLanguage.header_help = "Help";
            loadedLanguage.header_author = "Author";
            loadedLanguage.header_404 = "Page not found";
            loadedLanguage.eula_i_accept = "I accept the terms of license agreement";
            loadedLanguage.eula_continue = "Continue";
            loadedLanguage.parsing_ids_detected = "IDS detected";
            loadedLanguage.parsing_report_is_ready = "Your report is ready!";
            loadedLanguage.parsing_report_download = "Download in PDF";
            loadedLanguage.parsing_timestamp = "at";
            loadedLanguage.parsing_signature = "Signature";
            loadedLanguage.parsing_legal = "Legal";
            loadedLanguage.parsing_illegal = "Illegal";
            loadedLanguage.parsing_unknown = "Unknown";
            loadedLanguage.parsing_conn_total = "Total number of records in this log";
            loadedLanguage.parsing_date = "Parsing date";
            loadedLanguage.settings_language = "Language";
            loadedLanguage.settings_theme = "Styling theme";
            loadedLanguage.help_link_parsing = "Page &quot;Parsing&quot;";
            loadedLanguage.help_link_settings = "Page &quot;Settings&quot;";
            loadedLanguage.help_version = "Program version";
            loadedLanguage.help_build_date = "Build Date";
            loadedLanguage.help_license = "License";
            loadedLanguage.author_email = "E-mail";
            loadedLanguage.author_facebook = "Facebook";
            loadedLanguage.author_twitter = "Twitter";
            loadedLanguage.author_github = "Github";
            loadedLanguage.author_vk = "VK";
            loadedLanguage.author_diploma = "This project was made as the NSTU diploma";
            loadedLanguage.go_back = "Go back";
            loadedLanguage.btn_to_main_page = "Go to main page";
            loadedLanguage.btn_start_parsing = "Start parsing";
            loadedLanguage.btn_export_parsing = "Export result";
            loadedLanguage.btn_apply_settings = "Apply";
            loadedLanguage.msg_noscript = "Please, turn JavaScript in your browser!";
            loadedLanguage.msg_error = "Error!";
            loadedLanguage.msg_old_browser = "This browser does not support all the features that program uses. This program might still work, but errors could happen. It is highly recommended to use browser that is stated in the manual to avoid problems. The manual is located at the &quot;Help&quot; page.";
            loadedLanguage.msg_too_small = "The window width size is too small to show data parsing result. If you are using a mobile device, change your display's orientation to album.";
            loadedLanguage.msg_changed = "Changes were saved successfully!";
        } else if (lang == "he") {
            loadedLanguage.html_dir = "rtl";
            loadedLanguage.header_main_page = "דף הבית";
            loadedLanguage.header_eula = "הסכם רישיון";
            loadedLanguage.header_parsing = "עיבוד";
            loadedLanguage.header_settings = "הגדרות";
            loadedLanguage.header_help = "עזרה";
            loadedLanguage.header_author = "על המחבר";
            loadedLanguage.header_404 = "הדף לא נמצא";
            loadedLanguage.eula_i_accept = "אני מקבל את תנאי ההסכם";
            loadedLanguage.eula_continue = "המשך";
            loadedLanguage.parsing_ids_detected = "זוהה מערכת גילוי פריצה";
            loadedLanguage.parsing_report_is_ready = "הדוח שלך מוכן!";
            loadedLanguage.parsing_report_download = "הורד כקובץ PDF";
            loadedLanguage.parsing_timestamp = "אל";
            loadedLanguage.parsing_signature = "חתימה";
            loadedLanguage.parsing_legal = "חקי";
            loadedLanguage.parsing_illegal = "לא חוקי";
            loadedLanguage.parsing_unknown = "בלתי ברור";
            loadedLanguage.parsing_conn_total = "המספר הכולל של הרשומות ביומן זה";
            loadedLanguage.parsing_date = "תאריך עיבוד";
            loadedLanguage.settings_language = "שפה (Language)";
            loadedLanguage.settings_theme = "נושא";
            loadedLanguage.help_link_parsing = "סעיף &quot;עיבוד&quot;";
            loadedLanguage.help_link_settings = "סעיף &quot;הגדרות&quot;";
            loadedLanguage.help_version = "גרסה של התוכנית";
            loadedLanguage.help_build_date = "תאריך יצירה";
            loadedLanguage.help_license = "רישיון";
            loadedLanguage.author_email = "דוא''ל";
            loadedLanguage.author_facebook = "Facebook";
            loadedLanguage.author_twitter = "Twitter";
            loadedLanguage.author_github = "Github";
            loadedLanguage.author_vk = "VK";
            loadedLanguage.author_diploma = "פרויקט זה הוא תזה עבור אוניברסיטת מדינת נובוסיבירסק";
            loadedLanguage.go_back = "תחזור";
            loadedLanguage.btn_to_main_page = "לדף הראשי";
            loadedLanguage.btn_start_parsing = "התחל בעיבוד";
            loadedLanguage.btn_export_parsing = "תוצאת הייצוא";
            loadedLanguage.btn_apply_settings = "להגשת בקשה";
            loadedLanguage.msg_noscript = "הפוך את JavaScript לדפדפן שלך!";
            loadedLanguage.msg_error = "שגיאה!";
            loadedLanguage.msg_old_browser = "דפדפן זה אינו תומך בכל הטכנולוגיות שבהן משתמשת התוכנית. התוכנית יכולה לעבוד, אבל עם הפרעות. מומלץ מאוד להשתמש בדפדפן שצוין בהוראות כדי למנוע בעיות. ההוראות הן בסעיף &quot;עזרה&quot;.";
            loadedLanguage.msg_too_small = "רוחב החלון קטן מכדי להציג את תוצאת עיבוד הנתונים. אם אתה משתמש במכשיר נייד, שנה את כיוון המסך לרוחב.";
            loadedLanguage.msg_changed = "השינויים נשמרו בהצלחה!";
        } else if (lang == "uk") {
            loadedLanguage.html_dir = "ltr";
            loadedLanguage.header_main_page = "Головна сторінка";
            loadedLanguage.header_eula = "Ліцензійна угода";
            loadedLanguage.header_parsing = "Обробка";
            loadedLanguage.header_settings = "Налаштування";
            loadedLanguage.header_help = "Довідка";
            loadedLanguage.header_author = "Про автора";
            loadedLanguage.header_404 = "Сторінку не знайдено";
            loadedLanguage.eula_i_accept = "Я приймаю умови угоди";
            loadedLanguage.eula_continue = "Продовжити";
            loadedLanguage.parsing_ids_detected = "Відома СВВ";
            loadedLanguage.parsing_report_is_ready = "Ваш звіт готовий!";
            loadedLanguage.parsing_report_download = "Завантажити в форматі PDF";
            loadedLanguage.parsing_timestamp = "о";
            loadedLanguage.parsing_signature = "Сигнатура";
            loadedLanguage.parsing_legal = "Легітимний";
            loadedLanguage.parsing_illegal = "Нелегітимний";
            loadedLanguage.parsing_unknown = "Невизначений";
            loadedLanguage.parsing_conn_total = "Всього записів в журналі";
            loadedLanguage.parsing_date = "Дата обробки";
            loadedLanguage.settings_language = "Мова (Language)";
            loadedLanguage.settings_theme = "Тема оформлення";
            loadedLanguage.help_link_parsing = "Роздiл &quot;Обробка&quot;";
            loadedLanguage.help_link_settings = "Роздiл &quot;Налаштування&quot;";
            loadedLanguage.help_version = "Версія програми";
            loadedLanguage.help_build_date = "Дата складання";
            loadedLanguage.help_license = "Ліцензія";
            loadedLanguage.author_email = "Електронна пошта";
            loadedLanguage.author_facebook = "Facebook";
            loadedLanguage.author_twitter = "Twitter";
            loadedLanguage.author_github = "Github";
            loadedLanguage.author_vk = "VK";
            loadedLanguage.author_diploma = "Даний проект є дипломною роботою для Новосибірського Державного Технічного Університету";
            loadedLanguage.go_back = "Повернутися назад";
            loadedLanguage.btn_to_main_page = "На головну сторінку";
            loadedLanguage.btn_start_parsing = "Почати обробку";
            loadedLanguage.btn_export_parsing = "Експортувати результат";
            loadedLanguage.btn_apply_settings = "Застосувати";
            loadedLanguage.msg_noscript = "Будь ласка, увімкніть JavaScript у вашому браузері!";
            loadedLanguage.msg_error = "Помилка!";
            loadedLanguage.msg_old_browser = "Цей браузер підтримує не всі технології, які використовує програма. Програма може працювати, але з перебоями. Настійно рекомендується використовувати браузер, вказаний в інструкції, щоб уникнути виникнення проблем. Інструкція знаходиться в розділі &quot;Довiдка&quot;.";
            loadedLanguage.msg_too_small = "Розмір ширини вікна занадто малий, щоб відобразити результат обробки даних. Якщо ви використовуєте мобільний пристрій, змініть екран у горизонтальний.";
            loadedLanguage.msg_changed = "Зміни успішно збережені!";
        } else if (lang=="be"){ // lang = "be"
            loadedLanguage.html_dir = "ltr";
            loadedLanguage.header_main_page = "Галоўная старонка";
            loadedLanguage.header_eula = "Ліцэнзійнае пагадненне";
            loadedLanguage.header_parsing = "Апрацоўка";
            loadedLanguage.header_settings = "Налады";
            loadedLanguage.header_help = "Даведка";
            loadedLanguage.header_author = "Пра аўтара";
            loadedLanguage.header_404 = "Старонка не знойдзена";
            loadedLanguage.eula_i_accept = "Я прымаю ўмовы пагаднення";
            loadedLanguage.eula_continue = "Працягнуць";
            loadedLanguage.parsing_ids_detected = "Вядомая СВУ";
            loadedLanguage.parsing_report_is_ready = "Ваша справаздача гатова!";
            loadedLanguage.parsing_report_download = "Спампаваць у фармаце PDF";
            loadedLanguage.parsing_timestamp = "ў";
            loadedLanguage.parsing_signature = "Сігнатура";
            loadedLanguage.parsing_legal = "Легітымны";
            loadedLanguage.parsing_illegal = "Нелегітымны";
            loadedLanguage.parsing_unknown = "Нявызначаны";
            loadedLanguage.parsing_conn_total = "Усяго запісаў у часопісе";
            loadedLanguage.parsing_date = "Дата апрацоўкі";
            loadedLanguage.settings_language = "Мова (Language)";
            loadedLanguage.settings_theme = "Тэма афармлення";
            loadedLanguage.help_link_parsing = "Раздзел &quot;Апрацоўка&quot;";
            loadedLanguage.help_link_settings = "Раздзел &quot;Налады&quot;";
            loadedLanguage.help_version = "Версія праграмы";
            loadedLanguage.help_build_date = "Дата зборкі";
            loadedLanguage.help_license = "Ліцэнзія";
            loadedLanguage.author_email = "Электронная пошта";
            loadedLanguage.author_facebook = "Facebook";
            loadedLanguage.author_twitter = "Twitter";
            loadedLanguage.author_github = "Github";
            loadedLanguage.author_vk = "VK";
            loadedLanguage.author_diploma = "Дадзены праект з'яўляецца дыпломнай працай для Новасібірскага Дзяржаўнага Тэхнічнага Універсітэта";
            loadedLanguage.go_back = "Вярнуцца назад";
            loadedLanguage.btn_to_main_page = "На галоўную старонку";
            loadedLanguage.btn_start_parsing = "Пачаць апрацоўку";
            loadedLanguage.btn_export_parsing = "Экспартаваць вынік";
            loadedLanguage.btn_apply_settings = "Прымяніць";
            loadedLanguage.msg_noscript = "Калі ласка, уключыце JavaScript ў вашым браўзэры!";
            loadedLanguage.msg_error = "Памылка!";
            loadedLanguage.msg_old_browser = "Гэты браўзэр падтрымлівае не ўсе тэхналогіі, якія выкарыстоўвае праграма. Праграма можа працаваць, але з перабоямі. Настойліва рэкамендуецца выкарыстоўваць браўзэр, паказаны ў інструкцыі, каб пазбегнуць ўзнікнення праблем. Інструкцыя знаходзіцца ў раздзеле&quot;Даведка&quot;.";
            loadedLanguage.msg_too_small = "Памер шырыні акна занадта малы, каб адлюстраваць вынік апрацоўкі дадзеных. Калі вы выкарыстоўваеце мабільную прыладу, зменіце арыентацыю экрана на альбомную.";
            loadedLanguage.msg_changed = "Змены паспяхова захаваны!";
        }

        // DB below
    } else {
        loadedLanguage.html_dir = res.ru.html_dir;
    }


});


/***** Страницы ******/
// Лицензионное соглашение - по идее, должно загружаться в первый раз

app.get('/eula', function(req, res){
    res.render('eula', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_no_script,
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
        res.redirect('/eula');
        // Обновляем значение в БД, чтобы потом редиректа не было
        Setup.findOneAndUpdate({'eula': false}, {'eula': true});
    } else {
        res.render('index', {
            // Элементы на странице
            html_lang: lang,
            html_dir: loadedLanguage.html_dir,
            msg_noscript: loadedLanguage.msg_no_script,
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
        msg_noscript: loadedLanguage.msg_no_script,
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
    // TODO: 3) реализовать изменение настроек - доп
    res.render('settings', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_no_script,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        msg_changed: loadedLanguage.msg_changed,
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
        msg_noscript: loadedLanguage.msg_no_script,
        msg_old_browser: loadedLanguage.msg_old_browser,
        msg_too_small: loadedLanguage.msg_too_small,
        title: loadedLanguage.header_help,
        help_link_parsing: loadedLanguage.help_link_parsing,
        help_link_settings: loadedLanguage.help_link_settings,
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
        msg_noscript: loadedLanguage.msg_no_script,
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

app.get('/404', function(req, res){
    res.render('404', {
        html_lang: lang,
        html_dir: loadedLanguage.html_dir,
        msg_noscript: loadedLanguage.msg_no_script,
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

/***** Запуск сервера ******/
app.listen(port, function () {
    console.log('Parser was started, using port ' + port);
    console.log('Home directory: ' + __dirname);
  });


// Когда все запущено, то нужно отключиться от БД, чтобы процесс приложения завершился
// mongoose.disconnect();