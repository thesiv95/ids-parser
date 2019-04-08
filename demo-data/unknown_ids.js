/**
 * Extractor: Unknown IDS (PHPIDS)
 */

const fs = require('fs');
const regExp = require('./regexp');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var l = fs.readFileSync('demo-phpids.log', 'utf8');

var singleRecordObject = {}; // объект для записи в БД

// Разбиваем строку на блоки
l = l.split(',');

// Если не получилось - значит система неизвестна, на фронте выводим сбщ об ошибке (предупреждение)
// А в бэке просто останавливаем скрипт
if (l === null || l === undefined) return false;

// В противном случае, скрипт будет выполняться дальше
var dateTime = l[1].toString();

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


mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});

console.log('ok');
// "Шаблон" записи в БД
const uIdsSchema = new Schema({ 
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

var uIdsRecord = mongoose.model('uIdsRecord', uIdsSchema);

// Отформатированная запись в БД, которая будет добавлена

var record = new uIdsRecord({
    date_reg: singleRecordObject.times,
    time_reg: singleRecordObject.dates,
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


delete l;

