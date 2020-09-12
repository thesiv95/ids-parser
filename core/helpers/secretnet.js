/**
 * Extractor: IDS SecretNet
 */

const fs = require('fs');
const regExp = require('./regexp');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var parseString = require('xml2js').parseString; // библиотека для работы с xml
var detector = require('./../detector');

module.exports = {
	extract: function(){
		var l = fs.readFileSync(detector.pathToFile, 'utf8');
		parseString(l, function (err, result) {
			if (err) {
				console.log(err);
				return;
			}
			l = result;
		});
		
		var singleRecordObject = {}; // объект для записи в БД
		
		// Поиск строки с информацией
		var data = l["LacusEventLog"]["EventLogRecords"];
		data = data[0].r[0].$;
		
		// Куски информации
		var dateTime = data.tg;
		var connectionInfo = data.em;
		
		// console.log(connectionInfo);
		
		var SecretNet = {
			timeExtract: function(){
				var times = [];
				var time = dateTime.slice(11, 19);
				times.push(time);
				singleRecordObject.times = times;
			},
			dateExtract: function(){
				var dates = [];
				var date = dateTime.slice(0, 10);
				dates.push(date);
				singleRecordObject.dates = dates;
			},
			ipSrcExtract: function(){
				var ips = [];
				var ip = "";
				if (connectionInfo.match(regExp.ip)) {
					ip = connectionInfo.match(regExp.ip);
					ips.push(ip[0]);
				}
				singleRecordObject.ipsSrc = ips;
			},
			portSrcExtract: function(){
				var ports = [];
				var port = "";
				if (connectionInfo.match(regExp.portSecretNet)) {
					port = connectionInfo.match(regExp.portSecretNet);
					ports.push(port[9]);
					// ports.push(port);
				}
		
				singleRecordObject.portsSrc = ports;
			},
			ipDestExtract: function(){
				var ips = [];
				var ip = "";
				if (connectionInfo.match(regExp.ip)) {
					ip = connectionInfo.match(regExp.ip);
					ips.push(ip[1]);
				}
				
				singleRecordObject.ipsDest = ips;
			},
			portDestExtract: function(){
				var ports = [];
				var port = "";
				if (connectionInfo.match(regExp.portSecretNet)) {
					port = connectionInfo.match(regExp.portSecretNet);
					ports.push(port[10]);
				}
		
				singleRecordObject.portsDest = ports;
			},
			protocolExtract: function(){
				var protocols = [];
				var protocol = "";
				if (connectionInfo.match(regExp.protocol)) {
					protocol = connectionInfo.match(regExp.protocol);
					protocols.push(protocol[0]);
				}
		
				singleRecordObject.protocols = protocols;
			},
			defineSignature: function(){
				var signs = [];
				var sign = data.as;
				signs.push(sign);
				singleRecordObject.signatures = signs;
			},
			defineQuantity: function(){
				// TODO: придумать механизм подсчета
				var quantity = 0;
				if (quantity <= 0) quantity = 1;
				singleRecordObject.quantity = quantity;
			},
			defineStatus: function(){
				var status = '';
		
				switch (connectionInfo.indexOf('СОВ заблокировала') !== -1){
					case true:
						status = 'bad';
					case false:
						status = 'good';
					default:
						status = 'unknown';
				}
		
		
				// Когда статус не считался либо считался некорректно
				if (status === null || status === undefined) status = 'unknown';
				singleRecordObject.status = status;
			}
		};
		
		SecretNet.timeExtract();
		SecretNet.dateExtract();
		SecretNet.ipSrcExtract();
		SecretNet.portSrcExtract();
		SecretNet.ipDestExtract();
		SecretNet.portDestExtract();
		SecretNet.protocolExtract();
		SecretNet.defineQuantity();
		SecretNet.defineSignature();
		SecretNet.defineStatus();
		
		// Connection
		MongoClient.connect('mongodb+srv://siv:S4K21gW86DLHiK62@cluster0-7pfwr.mongodb.net/info?retryWrites=true&w=majority', function(err, db){
			db.collection('secretnetrecords').insert({
				ids_name: 'SecretNet',
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

