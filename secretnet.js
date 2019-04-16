/**
 * Extractor: IDS SecretNet
 */

const fs = require('fs');
const regExp = require('./regexp');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var parseString = require('xml2js').parseString; // библиотека для работы с xml
var detector = require('./detector');

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
		
		// DB connection
		mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});
		
		
		// "Шаблон" записи в БД
		const secretNetSchema = new Schema({ 
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
		
		var secretNetRecord = mongoose.model('secretNetRecord', secretNetSchema);
		
		// Отформатированная запись в БД, которая будет добавлена
		
		var record = new secretNetRecord({
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
			mongoose.disconnect();
			
		});
		
		delete l;
	}
}

