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
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});
// var dbc = mongoose.connection;
// var Schema = mongoose.Schema;
var drawOneRecord = new Object(); // объект для экспорта в шаблон страницы parsing

// dbc.on('error', console.error.bind(console, 'Connection error: '));
// dbc.once('open', function(callback) {

//     // Магия

//     var idsRecordSchema = {
//         ids_name: String,
//         date_reg: String,
//         time_reg: String,
//         ip_src: String,
//         port_src: Number,
//         ip_dest: String,
//         port_dest: Number,
//         protocol: String,
//         signatures: String,
//         conn_quantity: Number,
//         status: String
//     }; // один шаблон для всех


MongoClient.connect('mongodb://localhost:27017/info', function(err, db){
    switch (detector.detected){
        case 'Bro':

            // var broSchema = new Schema(idsRecordSchema);
            // var BroModel = mongoose.model('Bro', broSchema, 'brorecords');
            db.collection('brorecords').find({ids_name: 'Bro'}, function(err, recordings){
                if (err) console.log('error - ' + err);
                
                    if (recordings[0]){
                        drawOneRecord.ids_name = recordings[0]['ids_name'];
                        drawOneRecord.date_reg = recordings[0]['date_reg'];
                        drawOneRecord.time_reg = recordings[0]['time_reg'];
                        drawOneRecord.ip_src = recordings[0]['ip_src'];
                        drawOneRecord.port_src = recordings[0]['port_src'];
                        drawOneRecord.ip_dest = recordings[0]['ip_dest'];
                        drawOneRecord.port_dest = recordings[0]['port_dest'];
                        drawOneRecord.protocol = recordings[0]['protocol'];
                        drawOneRecord.signatures = recordings[0]['signatures'];
                        drawOneRecord.conn_quantity = recordings[0]['conn_quantity'];
                        drawOneRecord.status = recordings[0]['status'];
                        console.log(drawOneRecord);
                    
                }
            });
            break;
        case 'Dallas Lock':
            // var dallasLockSchema = new Schema(idsRecordSchema);
            // var DallasLockModel = mongoose.model('Dallas Lock', dallasLockSchema, 'dallaslockrecords');
            db.collection('dallaslockrecords').find({ids_name: 'Dallas Lock'}, function(err, recordings){
                
            
                if (err) console.log('error - ' + err);
                
                    if (recordings[0]){
                        drawOneRecord.ids_name = recordings[0]['ids_name'];
                        drawOneRecord.date_reg = recordings[0]['date_reg'];
                        drawOneRecord.time_reg = recordings[0]['time_reg'];
                        drawOneRecord.ip_src = recordings[0]['ip_src'];
                        drawOneRecord.port_src = recordings[0]['port_src'];
                        drawOneRecord.ip_dest = recordings[0]['ip_dest'];
                        drawOneRecord.port_dest = recordings[0]['port_dest'];
                        drawOneRecord.protocol = recordings[0]['protocol'];
                        drawOneRecord.signatures = recordings[0]['signatures'];
                        drawOneRecord.conn_quantity = recordings[0]['conn_quantity'];
                        drawOneRecord.status = recordings[0]['status'];
                        
                    }
               
            });
            break;
        case 'SecretNet':
            // var secretNetSchema = new Schema(idsRecordSchema);
            // var secretNetModel = mongoose.model('SecretNet', secretNetSchema, 'secretnetrecords');
            db.collection('secretnetrecords').find({ids_name: 'Secret Net'}, function(err, recordings) {
                if (err) console.log('error - ' + err);
                                
                    if (recordings[0]){
                        drawOneRecord.ids_name = recordings[0]['ids_name'];
                        drawOneRecord.date_reg = recordings[0]['date_reg'];
                        drawOneRecord.time_reg = recordings[0]['time_reg'];
                        drawOneRecord.ip_src = recordings[0]['ip_src'];
                        drawOneRecord.port_src = recordings[0]['port_src'];
                        drawOneRecord.ip_dest = recordings[0]['ip_dest'];
                        drawOneRecord.port_dest = recordings[0]['port_dest'];
                        drawOneRecord.protocol = recordings[0]['protocol'];
                        drawOneRecord.signatures = recordings[0]['signatures'];
                        drawOneRecord.conn_quantity = recordings[0]['conn_quantity'];
                        drawOneRecord.status = recordings[0]['status'];
                        
                    }
                
            }); 
            break;
        case 'Snort':
            
            db.collection('snortrecords').find({ids_name: 'Snort'}, function(err, recordings) {
                if (err) console.log('error - ' + err);
                                
                if (recordings[0]){
                    drawOneRecord.ids_name = recordings[0]['ids_name'];
                    drawOneRecord.date_reg = recordings[0]['date_reg'];
                    drawOneRecord.time_reg = recordings[0]['time_reg'];
                    drawOneRecord.ip_src = recordings[0]['ip_src'];
                    drawOneRecord.port_src = recordings[0]['port_src'];
                    drawOneRecord.ip_dest = recordings[0]['ip_dest'];
                    drawOneRecord.port_dest = recordings[0]['port_dest'];
                    drawOneRecord.protocol = recordings[0]['protocol'];
                    drawOneRecord.signatures = recordings[0]['signatures'];
                    drawOneRecord.conn_quantity = recordings[0]['conn_quantity'];
                    drawOneRecord.status = recordings[0]['status'];
                    
                }
                
            });
            
            break;
            case 'Suricata':
                // var suricataSchema = new Schema(idsRecordSchema);
                // var SuricataModel = mongoose.model('Suricata', suricataSchema, 'suricatarecords');
                db.collection('suricatarecords').find({ids_name: 'Suricata'}, function(err, recordings) {
                    if (err) console.log('error - ' + err);
                                
                    if (recordings[0]){
                        drawOneRecord.ids_name = recordings[0]['ids_name'];
                        drawOneRecord.date_reg = recordings[0]['date_reg'];
                        drawOneRecord.time_reg = recordings[0]['time_reg'];
                        drawOneRecord.ip_src = recordings[0]['ip_src'];
                        drawOneRecord.port_src = recordings[0]['port_src'];
                        drawOneRecord.ip_dest = recordings[0]['ip_dest'];
                        drawOneRecord.port_dest = recordings[0]['port_dest'];
                        drawOneRecord.protocol = recordings[0]['protocol'];
                        drawOneRecord.signatures = recordings[0]['signatures'];
                        drawOneRecord.conn_quantity = recordings[0]['conn_quantity'];
                        drawOneRecord.status = recordings[0]['status'];
                        
                    }
                });
                break;
        default:
            console.log('Default');
            break;
    }


    db.close();

});





module.exports = drawOneRecord;

