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
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

var drawOneRecord = new Object(); // объект для экспорта в шаблон страницы parsing

MongoClient.connect('mongodb+srv://siv:S4K21gW86DLHiK62@cluster0-7pfwr.mongodb.net/info?retryWrites=true&w=majority', function(err, db){
    console.log('Detected: ' + detector.detected);
    switch (detector.detected){
        case 'Bro':
            db.collection('brorecords').find({ids_name: 'Bro'}).toArray(function(err, recordings){
                // Определим последнюю запись в массиве, которая получилась в результате парсинга файла. Для этого нам понадобится значение длины массива (= кол-во записей в базе). В демо-версии выведем только 1 запись :)
                // И так в каждом случае.
                var recLength = recordings.length;
                // console.log(recordings[recLength - 1]._id);
                if (err) {
                    console.log('error - ' + err)
                } else {
                    // recLength - 1, т.к. значения массива нумеруются с 0
                    if (recordings[recLength - 1]){
                        drawOneRecord.ids_name = 'Zeek (' + recordings[recLength - 1].ids_name + ')'; // новое и старое название
                        drawOneRecord.date_reg = recordings[recLength - 1].date_reg;
                        drawOneRecord.time_reg = recordings[recLength - 1].time_reg;
                        drawOneRecord.ip_src = recordings[recLength - 1].ip_src;
                        drawOneRecord.port_src = recordings[recLength - 1].port_src;
                        drawOneRecord.ip_dest = recordings[recLength - 1].ip_dest;
                        drawOneRecord.port_dest = recordings[recLength - 1].port_dest;
                        drawOneRecord.protocol = recordings[recLength - 1].protocol;
                        drawOneRecord.signatures = recordings[recLength - 1].signatures;
                        drawOneRecord.conn_quantity = recordings[recLength - 1].conn_quantity;
                        drawOneRecord.status = recordings[recLength - 1].status;
                        
                    }
                };

            });
            break;
        case 'Dallas Lock':
            db.collection('dallaslockrecords').find({ids_name: 'Dallas Lock'}).toArray(function(err, recordings){
                var recLength = recordings.length;
                if (err) {
                    console.log('error - ' + err)
                } else {
                    if (recordings[recLength - 1]){
                        drawOneRecord.ids_name = recordings[recLength - 1].ids_name;
                        drawOneRecord.date_reg = recordings[recLength - 1].date_reg;
                        drawOneRecord.time_reg = recordings[recLength - 1].time_reg;
                        drawOneRecord.ip_src = recordings[recLength - 1].ip_src;
                        drawOneRecord.port_src = recordings[recLength - 1].port_src;
                        drawOneRecord.ip_dest = recordings[recLength - 1].ip_dest;
                        drawOneRecord.port_dest = recordings[recLength - 1].port_dest;
                        drawOneRecord.protocol = recordings[recLength - 1].protocol;
                        drawOneRecord.signatures = recordings[recLength - 1].signatures;
                        drawOneRecord.conn_quantity = recordings[recLength - 1].conn_quantity;
                        drawOneRecord.status = recordings[recLength - 1].status;
                        
                    }
                };

            });
            break;
        case 'SecretNet':
            db.collection('secretnetrecords').find({ids_name: 'SecretNet'}).toArray(function(err, recordings){
                var recLength = recordings.length;
                if (err) {
                    console.log('error - ' + err)
                } else {
                    if (recordings[recLength - 1]){
                        drawOneRecord.ids_name = recordings[recLength - 1].ids_name;
                        drawOneRecord.date_reg = recordings[recLength - 1].date_reg;
                        drawOneRecord.time_reg = recordings[recLength - 1].time_reg;
                        drawOneRecord.ip_src = recordings[recLength - 1].ip_src;
                        drawOneRecord.port_src = recordings[recLength - 1].port_src;
                        drawOneRecord.ip_dest = recordings[recLength - 1].ip_dest;
                        drawOneRecord.port_dest = recordings[recLength - 1].port_dest;
                        drawOneRecord.protocol = recordings[recLength - 1].protocol;
                        drawOneRecord.signatures = recordings[recLength - 1].signatures;
                        drawOneRecord.conn_quantity = recordings[recLength - 1].conn_quantity;
                        drawOneRecord.status = recordings[recLength - 1].status;
                        
                    }
                };

            });
            break;
        case 'Snort':
            db.collection('snortrecords').find({ids_name: 'Snort'}).toArray(function(err, recordings){
                var recLength = recordings.length;
                if (err) {
                    console.log('error - ' + err)
                } else {
                    if (recordings[recLength - 1]){
                        drawOneRecord.ids_name = recordings[recLength - 1].ids_name;
                        drawOneRecord.date_reg = recordings[recLength - 1].date_reg;
                        drawOneRecord.time_reg = recordings[recLength - 1].time_reg;
                        drawOneRecord.ip_src = recordings[recLength - 1].ip_src;
                        drawOneRecord.port_src = recordings[recLength - 1].port_src;
                        drawOneRecord.ip_dest = recordings[recLength - 1].ip_dest;
                        drawOneRecord.port_dest = recordings[recLength - 1].port_dest;
                        drawOneRecord.protocol = recordings[recLength - 1].protocol;
                        drawOneRecord.signatures = recordings[recLength - 1].signatures;
                        drawOneRecord.conn_quantity = recordings[recLength - 1].conn_quantity;
                        drawOneRecord.status = recordings[recLength - 1].status;
                        
                    }
                };

            });
                        
            break;
            case 'Suricata':
                db.collection('suricatarecords').find({ids_name: 'Suricata'}).toArray(function(err, recordings){
                    var recLength = recordings.length;
                    if (err) {
                        console.log('error - ' + err)
                    } else {
                        if (recordings[recLength - 1]){
                            drawOneRecord.ids_name = recordings[recLength - 1].ids_name;
                            drawOneRecord.date_reg = recordings[recLength - 1].date_reg;
                            drawOneRecord.time_reg = recordings[recLength - 1].time_reg;
                            drawOneRecord.ip_src = recordings[recLength - 1].ip_src;
                            drawOneRecord.port_src = recordings[recLength - 1].port_src;
                            drawOneRecord.ip_dest = recordings[recLength - 1].ip_dest;
                            drawOneRecord.port_dest = recordings[recLength - 1].port_dest;
                            drawOneRecord.protocol = recordings[recLength - 1].protocol;
                            drawOneRecord.signatures = recordings[recLength - 1].signatures;
                            drawOneRecord.conn_quantity = recordings[recLength - 1].conn_quantity;
                            drawOneRecord.status = recordings[recLength - 1].status;
                            
                        }
                    };

                });
                break;
        default:
            console.log('Default');
            break;
    }


    db.close();

});


module.exports = drawOneRecord;

