/**
 * Extractor: IDS Suricata
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
		l = l.split(' ');
		var datetime = l[0];
		datetime = datetime.split('-');
		
		var connectionSrc = l[8];
		connectionSrc = connectionSrc.split(':');
		
		var connectionDest = l[10];
		connectionDest = connectionDest.split(':');
		
		
		var Suricata = {
			timeExtract: function(){
				var times = [];
				timeExtracted = datetime[0].slice(0, 8);
				times.push(timeExtracted);
				singleRecordObject.times = times;
			},
			dateExtract: function(){
				var dates = [];
				dateExtracted = datetime[1].slice(0, 8);
				dates.push(dateExtracted);
				singleRecordObject.dates = dates;
			},
			ipSrcExtract: function(){
				var ips = [];
				ips.push(connectionSrc[0].toString());
				singleRecordObject.ipsSrc = ips;
			},
			portSrcExtract: function(){
				var ports = [];
				ports.push(connectionSrc[1].toString());
				singleRecordObject.portsSrc = ports;
			},
			ipDestExtract: function(){
				var ips = [];
				ips.push(connectionDest[0].toString());
				singleRecordObject.ipsDest = ips;
			},
			portDestExtract: function(){
				var ports = [];
				var port = connectionDest[1].toString();
				port = port.slice(0, 2);
				ports.push(port);
				singleRecordObject.portsDest = ports;
			},
			protocolExtract: function(){
				var protocol = 'TCP'; // в логе это никак не определяется!
				var protocols = [];
				protocols.push(protocol);
				singleRecordObject.protocols = protocols;
			},
			defineSignature: function(){
				var signs = [];
				var sign = l[6].toString();
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
				// в логе это тоже никак не определяется!
				var status = '';
				if (status === '') status = 'unknown';
				singleRecordObject.status = status;
			}
		};
		
		Suricata.timeExtract();
		Suricata.dateExtract();
		Suricata.ipSrcExtract();
		Suricata.portSrcExtract();
		Suricata.ipDestExtract();
		Suricata.portDestExtract();
		Suricata.protocolExtract();
		Suricata.defineQuantity();
		Suricata.defineSignature();
		Suricata.defineStatus();
		
		// Connection
		MongoClient.connect('mongodb+srv://siv:S4K21gW86DLHiK62@cluster0-7pfwr.mongodb.net/info?retryWrites=true&w=majority', function(err, db){
			db.collection('suricatarecords').insert({
				ids_name: 'Suricata',
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




