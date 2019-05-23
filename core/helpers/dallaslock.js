/**
 * Extractor: IDS DallasLock
 */
// 1. Импорт содержимого лог-файла
//  xml2js - npm https://www.npmjs.com/package/xml2js
// 2. Всю инф. вытаскиваем в массивы (ОЗУ)
// 3. Копируем всё в БД
// 4. Массивы из ОЗУ удаляем
// 5. Из БД копируем во фронт-енд
// 6. Во всех остальных экстракторах (на русский не переведешь) действуем по аналогии
const fs = require('fs');
const regExp = require('./regexp');
var parseString = require('xml2js').parseString;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// const mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var detector = require('./../detector');

module.exports = {
	extract: function(){
		var l = fs.readFileSync(detector.pathToFile, 'utf8');// указать путь
		// Сконвертировать XML-разметку в JS-объект
		parseString(l, function (err, result) {
			if (err) {
				console.log(err);
				return;
			}
			l = result;
		});

		var dlDateTime = l['Журнал']['Запись'][0].Время; // строка даты и времени
		dlDateTime = dlDateTime.toString().split(' '); // разбиение на дату и время
		var singleRecordObject = {}; // объект для записи в БД
		var dallasLock = {
			timeExtract: function(){
				var times = [];
				times.push(dlDateTime[1]);
				singleRecordObject.times = times;
			},
			dateExtract: function(){
				var dates = [];
				dates.push(dlDateTime[0]);
				singleRecordObject.dates = dates;
			},
			ipSrcExtract: function(){
				var ip = l['Журнал']['Запись'][0].Адрес_источника.toString();
				var ips = [];
				ips.push(ip);
				singleRecordObject.ipsSrc = ips;
			},
			portSrcExtract: function(){
				var port = l['Журнал']['Запись'][0].Порт_источника.toString();
				var ports = [];
				ports.push(port);
				singleRecordObject.portsSrc = ports;
			},
			ipDestExtract: function(){
				var ip = l['Журнал']['Запись'][0].Адрес_назначения.toString();
				var ips = [];
				ips.push(ip);
				singleRecordObject.ipsDest = ips;
			},
			portDestExtract: function(){
				var port = l['Журнал']['Запись'][0].Порт_назначения.toString();
				// уберем текст и переведем в число, чтобы убрать все пробелы
				port = port.slice(port.indexOf('(') + 1, port.indexOf(')'));
				port = parseInt(port);
				// Полученный результат переведем обратно в строку, чтобы сохранить типы данных, как у обработчиков других СОВ
				port = port.toString();
				var ports = [];
				ports.push(port);
				singleRecordObject.portsDest = ports;
			},
			protocolExtract: function(){
				var protocol = l['Журнал']['Запись'][0].Протокол.toString();
				var protocols = [];
				protocols.push(protocol);
				singleRecordObject.protocols = protocols;
			},
			defineSignature: function(){
				var sign = l['Журнал']['Запись'][0].ID_сигнатуры.toString();
				// Переведем транслитом, чтобы можно было корректно экспортнуть в отчет. К сожалению, библиотека для генерации pdf читает только латинские символы...
				if (sign === '(детектор атак)') {
					sign = '(detektor atak)';
				}
				var signs = [];
				signs.push(sign);
				singleRecordObject.signatures = signs;
			},
			defineQuantity: function(){
				var connectionMessage = l['Журнал']['Запись'][0].Сообщение;
				// console.log(connectionMessage);
				// Количество совпадений "ТСР" = количеству подключений! Все гениальное просто))))
				// ???
				// https://learn.javascript.ru/string
				var quantity = 0;
				var target = 'TCP';
				var pos = -1;
				while ((pos = connectionMessage.indexOf(target, pos + 1)) != -1) {
					quantity++;
				}
				// Если число подключений получилось 0 или отрицательным, то делаем 1 (всегда будет как минимум 1 подключение)
				if (quantity <= 0) quantity = 1;
				singleRecordObject.quantity = quantity;
			},
			defineStatus: function(){
				var statusString = l['Журнал']['Запись'][0].Результат;
				statusString = statusString[0].toString();
				// console.log(statusString);
				if (statusString == 'Доступ запрещен !'){
						status = 'bad';
				} else {
						status = 'unknown';
				}
				singleRecordObject.status = status;
			}
		};


		dallasLock.timeExtract();
		dallasLock.dateExtract();
		dallasLock.ipSrcExtract();
		dallasLock.portSrcExtract();
		dallasLock.ipDestExtract();
		dallasLock.portDestExtract();
		dallasLock.protocolExtract();
		dallasLock.defineSignature();
		dallasLock.defineQuantity();
		dallasLock.defineStatus();

	// Connection
	MongoClient.connect('mongodb://localhost:27017/info', function(err, db){
        db.collection('dallaslockrecords').insert({
            ids_name: 'Dallas Lock',
            date_reg: singleRecordObject.dates[0],
            time_reg: singleRecordObject.times[0],
            ip_src: singleRecordObject.ipsSrc[0],
            port_src: parseInt(singleRecordObject.portsSrc),
            ip_dest: singleRecordObject.ipsDest[0],
            port_dest: parseInt(singleRecordObject.portsDest),
            protocol: singleRecordObject.protocols[0],
            signatures: singleRecordObject.signatures[0],
            conn_quantity: singleRecordObject.quantity,
            status: singleRecordObject.status
        });

        db.close();
    });

		delete l;
	}
}




