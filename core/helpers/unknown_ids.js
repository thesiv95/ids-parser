/**
 * Extractor: Unknown IDS (PHPIDS)
 */

const fs = require('fs');
const regExp = require('./regexp');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

var detector = require('./../detector');


module.exports = {
	extract: function(){
		var l = fs.readFileSync(detector.pathToFile, 'utf8');

		var singleRecordObject = {}; // объект для записи в БД
		
		// Разбиваем строку на блоки
		l = l.split(',');
		
		// Если не получилось - значит система неизвестна, выводим сбщ об ошибке (предупреждение)
		// Ну и останавливаем скрипт
		if (!l || l === null || l === undefined) {
			console.log('Warning! Unknown IDS');
			return false;
		};
		
		// В противном случае, скрипт будет выполняться дальше
		var dateTime = l[1].toString();
		
		// PHPIDS
		var uIds = {
			timeExtract: function(){
				var time = dateTime.slice(0, 10);
				// Если не обнаружено - выводим заглушку
				// И так везде
				if (time === null || time === undefined) time = '(time not found!)';
				var times = [];
				times.push(time);
				singleRecordObject.times = times;
			},
			dateExtract: function(){
				var date = dateTime.slice(11, 19);
				if (date === null || date === undefined) date = '(date not found!)';
				var dates = [];
				dates.push(date);
				singleRecordObject.dates = dates;
			},
			ipSrcExtract: function(){
				var ip = l[0].toString();
				if (ip === null || ip === undefined) ip = '(source IP not found!)';
				var ips = [];
				ips.push(ip);
				singleRecordObject.ipsSrc = ips;
			},
			portSrcExtract: function(){
				var port = l[2].toString();
				if (port === null || port === undefined) port = '(source port not found!)';
				var ports = [];
				ports.push(port);
				singleRecordObject.portsSrc = ports;
			},
			ipDestExtract: function(){
				// Нет данных! Пишем, что ничего нет 
				var ips = '';
				ips = '(dest. IP not found!)';
				singleRecordObject.ipsDest = ips;
			},
			portDestExtract: function(){
				// Нет данных! Пишем, что ничего нет (порт 0)
				var ports = '';
				if (ports == '') ports = 0;
				singleRecordObject.portsDest = ports;
			},
			protocolExtract: function(){
				var protocol = "";
				var protocols = [];
				// Рассчитаем по GET-запросу
				var requestString = l[4].toString();
		
				switch(requestString.indexOf('GET') !== -1){
					case true:
						protocol = "TCP";
					case false:
						protocol = "UDP";
					default:
						protocol = "TCP";
				}
		
				protocols.push(protocol);
				singleRecordObject.protocols = protocols;
			},
			defineSignature: function(){
				var sign = l[3].toString();
				var signs = [];
				signs.push(sign);
				singleRecordObject.signatures = signs;
			},
			defineQuantity: function(){
				// Пока оставим так
				var quantity = 0;
				if (quantity <= 0) quantity = 1;
				singleRecordObject.quantity = quantity;
				console.log(quantity);
			},
			defineStatus: function(){
				var status = '';
		
				switch(l[4]){
					case '"xss csrf id rfe lfi"':
						status = 'bad';
					case null:
						status = 'unknown';
					case undefined:
						status = 'unknown';
					default:
						status = 'good';
				}
		
				singleRecordObject.status = status;
		
			}
		};
		
		
		uIds.timeExtract();
		uIds.dateExtract();
		uIds.ipSrcExtract();
		uIds.portSrcExtract();
		uIds.ipDestExtract();
		uIds.portDestExtract();
		uIds.protocolExtract();
		uIds.defineQuantity();
		uIds.defineSignature();
		uIds.defineStatus();
		
		
		// Connection
		MongoClient.connect('mongodb+srv://siv:S4K21gW86DLHiK62@cluster0-7pfwr.mongodb.net/info?retryWrites=true&w=majority', function(err, db){
			db.collection('uidsrecords').insert({
				ids_name: '?',
				date_reg: singleRecordObject.dates[0],
				time_reg: singleRecordObject.times[0],
				ip_src: singleRecordObject.ipsSrc[0],
				port_src: singleRecordObject.portsSrc[0],
				ip_dest: singleRecordObject.ipsDest,
				port_dest: singleRecordObject.portsDest,
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



