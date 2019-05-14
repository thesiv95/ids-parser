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

MongoClient.connect('mongodb://localhost:27017/info', function(err, db){
    console.log('Detected: ' + detector.detected);
    switch (detector.detected){
        case 'Bro':
            db.collection('brorecords').find({ids_name: 'Bro'}).toArray(function(err, recordings){
                // в демо-версии выведем только 1 запись :)
                if (err) {
                    console.log('error - ' + err)
                } else {
                    if (recordings[0]){
                        drawOneRecord.ids_name = 'Zeek (' + recordings[0].ids_name + ')'; // новое и старое название
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
                        
                    }
                };

            });
            break;
        case 'Dallas Lock':
            db.collection('dallaslockrecords').find({ids_name: 'Dallas Lock'}).toArray(function(err, recordings){
                // в демо-версии выведем только 1 запись :)
                if (err) {
                    console.log('error - ' + err)
                } else {
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
                        
                    }
                };

            });
            break;
        case 'SecretNet':
            db.collection('secretnetrecords').find({ids_name: 'SecretNet'}).toArray(function(err, recordings){
                // в демо-версии выведем только 1 запись :)
                if (err) {
                    console.log('error - ' + err)
                } else {
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
                        
                    }
                };

            });
            break;
        case 'Snort':
            db.collection('snortrecords').find({ids_name: 'Snort'}).toArray(function(err, recordings){
                // в демо-версии выведем только 1 запись :)
                if (err) {
                    console.log('error - ' + err)
                } else {
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
                        
                    }
                };

            });
                        
            break;
            case 'Suricata':
                db.collection('suricatarecords').find({ids_name: 'Suricata'}).toArray(function(err, recordings){
                    // в демо-версии выведем только 1 запись :)
                    if (err) {
                        console.log('error - ' + err)
                    } else {
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

