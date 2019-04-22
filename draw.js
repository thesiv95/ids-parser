// Модуль отрисовки диаграммы. План действий
// 1. Импортировать название СОВ (модуль детектор)
// 2. Подключиться к БД
// 3. В зависимости от полученного названия СОВ выбрать нужную коллекцию в БД
// 4. Оттуда вытащить всю инфу
// 5. Всю полученную инфу экспортируем через модуль-экспорт 
// и отправляем в шаблонизатор (индексный файл), т.к. библиотека d3 подключается на клиенте
// и, по сути, все, что нужно сделать - это подставить данные
// !!! нужно вызвать модуль после экстратора по идее
const detector = require('./detector');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});
var dbc = mongoose.connection;
var Schema = mongoose.Schema;
var drawOneRecord = new Object(); // объект для экспорта в шаблон страницы parsing

dbc.on('error', console.error.bind(console, 'Connection error: '));
dbc.once('open', function(callback) {

    // Магия

    var idsRecordSchema = {
        ids_name: String,
        date_reg: String,
        time_reg: String,
        ip_src: String,
        port_src: Number,
        ip_dest: String,
        port_dest: Number,
        protocol: String,
        signatures: String,
        conn_quantity: Number,
        status: String
    }; // один шаблон для всех

    switch (detector.detected){
        case 'Snort':
            var snortSchema = new Schema(idsRecordSchema);
            var SnortModel = mongoose.model('Snort', snortSchema, 'snortrecords');
            SnortModel.find({ids_name: 'Snort'}, function(err, recordings) {
                if (err) console.log('error - ' + err);
                // Записываем в объект вывода
                console.log(recordings[0]);
                // drawOneRecord.ids_name = recordings[0].ids_name;
                // drawOneRecord.date_reg = recordings[0].date_reg;
                // drawOneRecord.time_reg = recordings[0].time_reg;
                // drawOneRecord.ip_src = recordings[0].ip_src;
                // drawOneRecord.port_src = recordings[0].port_src;
                // drawOneRecord.ip_dest = recordings[0].ip_dest;
                // drawOneRecord.port_dest = recordings[0].port_dest;
                // drawOneRecord.protocol = recordings[0].protocol;
                // drawOneRecord.signatures = recordings[0].signatures;
                // drawOneRecord.conn_quantity = recordings[0].conn_quantity;
                // drawOneRecord.status = recordings[0].status;
                
            });
            
            break;
        default:
            console.log('Default');
            break;
    }


});


// Записи не добавляются в объект внутри switch/case :(
// потому что все асинхронно
// как бы сделать синхронно?
drawOneRecord.foo = 'bar';



// 192.168.1.20:123 -> 8.8.8.8:444 [TCP] в 21.11.2017 10:00:01 - 55 
// Сигнатура [cve] [icat] [cve] [icat] [bugtraq] [bugtraq] [bugtraq] [snort]
// Объект для экспорта

console.log('draw record');
console.log(drawOneRecord);

// Что останется:
// Допилить модуль пдфки
// Доделать скрины, вставить в текст ВКР - тогда текст будет готов (если научрук не скажет что-то еще поправить канеш)
// Реализовать изменение настроек (языки в отдельной БД)
// И в принципе сырая версия приложения готова (сырая, но хоть что-то)

module.exports = drawOneRecord;

// mongoose.disconnect();