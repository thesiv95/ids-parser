/**
 * TODO: Extractor: IDS Bro
 */
const fs = require('fs');
const regExp = require('./regexp');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var detector = require('./detector');
var l = fs.readFileSync(detector.pathToFile, 'utf8');// указать путь

var singleRecordObject = {}; // объект для записи в БД

/* Разбитие считанного текста для того, чтобы с ним было удобнее работать в дальнейшем */
l = l.split(' ');
/* Помещаем все данные сюда, форматируем для более удобного извлечения информации */
var data = l[1].toString();
data = data.split('\t');

var datetime = data[5];
datetime = datetime.slice(0, 20);

var Bro = {
	timeExtract: function(){
		var times = [];
		var time = datetime.slice(0, 10);
		times.push(time);
		singleRecordObject.times = times;
	},
	dateExtract: function(){
		var dates = [];
		var date = datetime.slice(11, 19);
		dates.push(date);
		singleRecordObject.dates = dates;
	},
	ipSrcExtract: function(){
		var ips = [], ipsTemp = []; // временный массив, чтобы потом добавить только четные позиции (и нечетные позиции для айпи назначения)
		var ip = "";
		for (var i = 0; i < data.length; i++){
			if (data[i].match(regExp.ip)) {
				ip = data[i].match(regExp.ip);
				ip = ip.toString();
				ipsTemp.push(ip);
			}
		}

		for (var j = 0; j < ipsTemp.length; j++){
			if (j % 2 === 0) {
				ips.push(ipsTemp[j]);
			}
		}

		singleRecordObject.ipsSrc = ips;
	},
	portSrcExtract: function(){
		var ports = [], portsTemp = [];
		var port = "";
		for (var i = 0; i < data.length; i++){
			if (data[i].match(regExp.portBro)) {
				port = data[i].match(regExp.portBro);
				port = port.toString();
				portsTemp.push(port);
			}
		}
		// Приходится пропускать позиции в массиве portsTemp
		// пока не точная фильтрация...
		for (var j = 0; j < portsTemp.length; j++){
			if (j % 9 === 0) {
				ports.push(portsTemp[j]);
			}
		}

		singleRecordObject.portsSrc = ports;
	},
	ipDestExtract: function(){
		// ipsTemp - временный массив, чтобы потом добавить только четные позиции (и нечетные позиции для айпи назначения)
		var ips = [], ipsTemp = []; 
		var ip = "";
		for (var i = 0; i < data.length; i++){
			if (data[i].match(regExp.ip)) {
				ip = data[i].match(regExp.ip);
				ip = ip.toString();
				ipsTemp.push(ip);
			}
		}

		for (var j = 0; j < ipsTemp.length; j++){
			if (j % 2 === 1) {
				ips.push(ipsTemp[j]);
			}
		}

		singleRecordObject.ipsDest = ips;
	},
	portDestExtract: function(){
		var ports = [], portsTemp = [];
		var port = "";
		for (var i = 0; i < data.length; i++){
			if (data[i].match(regExp.portBro)) {
				port = data[i].match(regExp.portBro);
				port = port.toString();
				portsTemp.push(port);
			}
			
		}
		
		// Приходится пропускать позиции в массиве portsTemp
		// пока не точная фильтрация...
		for (var j = 0; j < portsTemp.length; j++){
			if (j % 9 === 1) {
				ports.push(portsTemp[j]);
			}
		}

		singleRecordObject.portsDest = ports;
	},
	protocolExtract: function(){
		var protocols = [];
		var protocol = "";
		for (var i = 0; i < data.length; i++){
			if (data[i].match(regExp.protocol)) {
				protocol = data[i].match(regExp.protocol);
				protocol = protocol.toString();
				protocols.push(protocol);
			}
		}
		singleRecordObject.protocols = protocols;
	},

	defineSignature: function(){
		var signs = [];

		for (var i = 0; i < data.length; i++){
			if (data[i].match(regExp.signatureBro)) {
				signs.push(data[i]);
			}
		}
		singleRecordObject.signatures = signs;
	},
	defineQuantity: function(){
		var quantity = 0;

		for (var i = 0; i < data.length; i++) {
			if (data[i].match(regExp.connectionIdBro)) {
				quantity++;
			}
		}
		if (quantity <= 0) quantity = 1;
        singleRecordObject.quantity = quantity;
	},
	defineStatus: function(){
		// в логе четко не прописано
		var status = '';
		status = 'good';
		if (status === null || status === undefined) status = 'unknown';
        singleRecordObject.status = status;
	}
};

Bro.timeExtract();
Bro.dateExtract();
Bro.ipSrcExtract();
Bro.portSrcExtract(); // допилить
Bro.ipDestExtract();
Bro.portDestExtract();// допилить
Bro.protocolExtract();
Bro.defineQuantity(); // допилить
Bro.defineSignature(); // допилить
Bro.defineStatus();

mongoose.connect('mongodb://localhost:27017/info', {useNewUrlParser: true});

console.log('ok');
// "Шаблон" записи в БД
const BroSchema = new Schema({ 
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

var BroRecord = mongoose.model('BroRecord', BroSchema);

// Отформатированная запись в БД, которая будет добавлена

var record = new BroRecord({
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
	mongoose.disconnect();
    
});


delete l;





