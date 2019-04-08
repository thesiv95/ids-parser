/*
* Extractor: IDS Snort
*/

const fs = require('fs');
const regExp = require('./regexp');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var l = fs.readFileSync('demo-snort.txt', 'utf8');

var singleRecordObject = {}; // объект для записи в БД

/* Разбитие считанного текста для того, чтобы с ним было удобнее работать в дальнейшем */
l = l.split(' ');

// console.log(l);

var Snort = {
    // Время
    timeExtract: function (){
        var times = [];
        for (var i = 0; i < l.length; i++){
            // нужно отсечь лишние строки, начинающиеся с табуляции
            if (l[i].match(regExp.time) && l[i].indexOf('\t') === -1) {
                times.push(l[i]);
            }  
        }
        singleRecordObject.times = times;
    },
    // Дата
    dateExtract: function (){
        var dates = [];
        for (var i = 0; i < l.length; i++){
            if (l[i].match(regExp.dateSnort)) {
                dates.push(l[i]);
            }  
        }
        // Убираем '\t'
        for (var j = 0; j < dates.length; j++) {
            dates[j] = dates[j].slice(1);     
        }
        singleRecordObject.dates = dates;
    },
    // IP источника
    ipSrcExtract: function (){
        var ips = [];
        for (var i = 1; i < l.length - 1; i++){
            // Заносим только нечётные элементы в массив, т.к. четные - это айпи назначения в логе
            // ??? странно работает цикл, но пока что оставим так
            if (l[i].match(regExp.ip) ) {
                if (i % 2 == 0) {
                    ips.push(l[i]);
                }  
            }  
        }
        // Убираем '\t' , ':' и порт
        for (var j = 0; j < ips.length; j++) {
            ips[j] = ips[j].slice(1, 13);  // убрали порт
        }
        // у ip с одной цифрой на конце при выборке осталось : - уберем его  
        for (var k = 0; k < ips.length; k++) {
            if (ips[k].indexOf(':') == 11) {
                ips[k] = ips[k].slice(0, 11);
                
            }
        }
        singleRecordObject.ipsSrc = ips;
    },
    // Порт источника
    portSrcExtract: function (){
        var ports = [];
        // т.к. в основной массив l попал и айпи, и порт, придется выцеплять по регулярке для IP
        for (var i = 1; i < l.length - 1; i++){
            if (l[i].match(regExp.ip) ) {
                if (i % 2 == 0) {
                    ports.push(l[i]);
                }
                
            }  
        }
    
        // Убираем все, кроме порта
        for (var j = 0; j < ports.length; j++) {
            ports[j] = ports[j].slice(13);
        }
    
        // Нужно убрать двоеточие, там, где оно осталось
        for (var k = 0; k < ports.length; k++) {
            if (ports[k].indexOf(':') == 0) {
                ports[k] = ports[k].slice(1);
            
            }
        }
    
        singleRecordObject.portsSrc = ports;
    },
    // IP назначения
    ipDestExtract: function() {
        var ips = [];

        for (var i = 1; i < l.length - 1; i++){
            // Заносим только чётные элементы в массив, т.к. нечетные - это айпи источника в логе
            if (l[i].match(regExp.ip) ) {
                if (i % 2 == 1) {
                    ips.push(l[i]);
                }
                
            }  
        }

        // Убираем '\t' , ':' и порт
        for (var j = 0; j < ips.length; j++) {
            ips[j] = ips[j].slice(1, 13);  // убрали порт
        }

        // у ip с одной цифрой на конце при выборке осталось : - уберем его  
        for (var k = 0; k < ips.length; k++) {
            if (ips[k].indexOf(':') == 11) {
                ips[k] = ips[k].slice(0, 11);
                
            }
        }

        singleRecordObject.ipsDest = ips;
    },
    
    // Порт назначения
    portDestExtract: function (){
        var ports = [];
        // т.к. в основной массив l попал и айпи, и порт, придется выцеплять по регулярке для IP
        for (var i = 1; i < l.length - 1; i++){
            if (l[i].match(regExp.ip) ) {
                if (i % 2 == 1) {
                    ports.push(l[i]);
                }
                
            }  
        }
    
        // Убираем все, кроме порта
        for (var j = 0; j < ports.length; j++) {
            ports[j] = ports[j].slice(13);
        }
    
        // Нужно убрать двоеточие, там, где оно осталось
        for (var k = 0; k < ports.length; k++) {
            if (ports[k].indexOf(':') == 0) {
                ports[k] = ports[k].slice(1);
                
            }
        }
        singleRecordObject.portsDest = ports;
    },

    protocolExtract: function(){
        var protocols = [];
        var protocol = "";
        for (var i = 0; i < l.length; i++){
            if (l[i].match(regExp.protocol)){
                protocol = l[i].match(regExp.protocol);
                protocol = protocol.toString().toUpperCase(); // конвертация из лишнего массива в строку, чтобы не
                // получился массив в массиве, а также большие буквы
                protocols.push(protocol);
            }
        }
        singleRecordObject.protocols = protocols;
    },
     // Сигнатура. Строка не полная!! пока не знаю как сделать всю строку
     defineSignature: function (){
        var signs = [];
    
        for (var i = 0; i < l.length; i++){
            if (l[i].match(regExp.signatureSnort)){
                signs.push(l[i]);
            }
        }
        // отсекаем лишние символы
        for (var j = 0; j < signs.length; j++) {
            if (signs[j].indexOf('\t') !== -1) {
                signs[j] = signs[j].slice(1);
            }  
        }
        singleRecordObject.signatures = signs;
    },
    // Кол-во подключений (= кол-ву строк в логе)
    // Если их меньше 0 или 0, то делаем 1 (так как одно подключение к объекту с СОВ точно было)
    defineQuantity: function (){
        var quantity = 0;
    
        for (var i = 0; i < l.length; i++){
            if (l[i].match(regExp.quantity)){
                quantity++;
            }
        }

        if (quantity <= 0) quantity = 1;
        singleRecordObject.quantity = quantity;
    },
    defineStatus: function(){
        var status = '';
        for (var i = 0; i < l.length; i++){
            if (l[i].indexOf('Suspicious') !== -1){
                status = 'bad';
            } else {
                status = 'good';
            }
        }

        if (status === null || status === undefined) status = 'unknown';
        singleRecordObject.status = status;

    }
};

// Быстрый вызов функций, извлекающих из текста нужную инфу
Snort.timeExtract();
Snort.dateExtract();
Snort.ipSrcExtract();
Snort.portSrcExtract();
Snort.ipDestExtract();
Snort.portDestExtract();
Snort.protocolExtract();
Snort.defineQuantity();
Snort.defineSignature();
Snort.defineStatus();

mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});

console.log('ok');
// "Шаблон" записи в БД
const snortSchema = new Schema({ 
    date_reg: String,
    time_reg: String,
    ip_src: String,
    port_src: Number,
    ip_dest: String,
    port_dest: Number,
    protocol: String,
    conn_quantity: Number,
    status: String
 });

var SnortRecord = mongoose.model('SnortRecord', snortSchema);

// Отформатированная запись в БД, которая будет добавлена

var record = new SnortRecord({
    date_reg: singleRecordObject.dates,
    time_reg: singleRecordObject.times,
    ip_src: singleRecordObject.ipsSrc,
    port_src: parseInt(singleRecordObject.portsSrc),
    ip_dest: singleRecordObject.ipsDest,
    port_dest: parseInt(singleRecordObject.portsDest),
    protocol: singleRecordObject.protocols,
    conn_quantity: singleRecordObject.quantity,
    status: singleRecordObject.status
});

console.log(record);

record.save(function(err){
    if (err !== null) {
		console.log('Ошибка записи');
		console.log(err);
	}
});

// Удаление массива для очищения ОЗУ
delete l;