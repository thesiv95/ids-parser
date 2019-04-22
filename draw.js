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


    /****** promise */
    // var a = 3, b;

    // var addToDrawObject = new Promise(function (resolve, reject) {
    //     if (a == 3){
    //         b = 3;
    //         resolve(b);
    //     } else {
    //         var c = new Error(10);
    //         reject(c);
    //     }
    // });
    // var askMom = function () {
    //     addToDrawObject
    //         .then(function (fulfilled) {
    //             console.log(fulfilled);
    //         })
    //         .catch(function (error) {
    //             console.log(error.message);
    //         });
    // };
    
    // askMom();
    /****** promise */


    switch (detector.detected){
        case 'Bro':
            console.log('Bro');
            break;
        case 'Dallas Lock':
            console.log('Dallas');
            var dallasLockSchema = new Schema(idsRecordSchema);
            var DallasLockModel = mongoose.model('Dallas Lock', dallasLockSchema, 'dallaslockrecords');
            DallasLockModel.find({}, function(err, recordings){
                if (err) console.log('error - ' + err);
                var drawPromise = new Promise(function (resolve, reject) {
                    if (recordings[0]){
                        drawOneRecord.ids_name = recordings[0].ids_name;
                        drawOneRecord.date_reg = recordings[0].date_reg;
                        drawOneRecord.time_reg = recordings[0].time_reg;
                        drawOneRecord.ip_src = recordings[0].ip_src;
                        drawOneRecord.port_src = recordings[0].port_src;
                        drawOneRecord.ip_dest = recordings[0].ip_dest;
                        drawOneRecord.port_dest = recordings[0].port_dest;
                        drawOneRecord.protocol = recordings[0].protocol;
                        drawOneRecord.signatures = recordings[0].signatures;
                        drawOneRecord.conn_quantity = recordings[0].conn_quantity;
                        drawOneRecord.status = recordings[0].status;

                        resolve(console.log(drawOneRecord));
                    } else {
                        var e = new Error(error);
                        reject(e);
                    }
                });

                var addToDrawObject = function () {
                    drawPromise
                        .then(function (done) {
                            console.log(done);
                        })
                        .catch(function (error) {
                            console.log(error.message);
                        });
                }

                addToDrawObject();
            })
            break;
        case 'SecretNet':
            console.log('SecretNet');
            break;
        case 'Snort':
            var snortSchema = new Schema(idsRecordSchema);
            var SnortModel = mongoose.model('Snort', snortSchema, 'snortrecords');
            SnortModel.find({ids_name: 'Snort'}, function(err, recordings) {
                if (err) console.log('error - ' + err);
                // Записываем в объект вывода
                // console.log(recordings[0]);

                var drawPromise = new Promise(function (resolve, reject) {
                    if (recordings[0]){
                        drawOneRecord.ids_name = recordings[0].ids_name;
                        drawOneRecord.date_reg = recordings[0].date_reg;
                        drawOneRecord.time_reg = recordings[0].time_reg;
                        drawOneRecord.ip_src = recordings[0].ip_src;
                        drawOneRecord.port_src = recordings[0].port_src;
                        drawOneRecord.ip_dest = recordings[0].ip_dest;
                        drawOneRecord.port_dest = recordings[0].port_dest;
                        drawOneRecord.protocol = recordings[0].protocol;
                        drawOneRecord.signatures = recordings[0].signatures;
                        drawOneRecord.conn_quantity = recordings[0].conn_quantity;
                        drawOneRecord.status = recordings[0].status;

                        resolve(console.log(drawOneRecord));
                    } else {
                        var e = new Error(error);
                        reject(e);
                    }
                });

                var addToDrawObject = function () {
                    drawPromise
                        .then(function (done) {
                            console.log(done);
                        })
                        .catch(function (error) {
                            console.log(error.message);
                        });
                }

                addToDrawObject();
                
            });
            
            break;
            case 'Suricata':
                console.log('Suricata');
                break;
        default:
            console.log('Default');
            break;
    }


});



// Что останется:
// Допилить модуль пдфки
// Доделать скрины, вставить в текст ВКР - тогда текст будет готов (если научрук не скажет что-то еще поправить канеш)
// Реализовать изменение настроек (языки в отдельной БД)
// И в принципе сырая версия приложения готова (сырая, но хоть что-то)

module.exports = drawOneRecord;

// mongoose.disconnect();