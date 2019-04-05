var express = require('express');
var app = express();
var path = require('path');

var port = 3000;


app.set('views', __dirname + '/views'); // папка с файлы шаблонов
app.set('view engine', 'pug'); // шаблонизатор страницы

app.use(express.static('public')); // папка для статических файлов (то есть стили css, скрипты js, и т.п.)

// Home page
app.get('/', function(req, res){
  req.setEncoding('utf-8');
  res.cookie('eula', 'yes', {httpOnly: true, maxAge: 5000});
  res.render('index', { html_lang: 'ru', html_dir: 'ltr',  page_title: 'Главная страница'});
  res.end();
});

app.get('/parsing', function (req, res) {
  res.render('parsing', { html_lang: 'ru', html_dir: 'ltr',  page_title: 'Обработка'});
});

app.get('/settings', function (req, res) {

  res.render('settings', { html_lang: 'ru', html_dir: 'ltr',  page_title: 'Настройки'});
  
});

app.get('/help', function (req, res) {
  res.render('help', { html_lang: 'ru', html_dir: 'ltr',  page_title: 'Справка'});
});

app.get('/author', function (req, res) {

  res.render('author', { html_lang: 'ru', html_dir: 'ltr',  page_title: 'Об авторе'});
  
});

app.listen(port, function () {
  console.log('Parser was started, using port ' + port);
  console.log('Home directory: ' + __dirname);
});
