const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

module.exports = {
    init: function(){
        
    // Установка демо-баз приложения (база должна быть пустой!);
    // При отсутствии баз данных с такими именами они будут созданы автоматически
        console.log('Installation');

        MongoClient.connect('mongodb://localhost:27017/config', function(err, db){

            if (err) throw err;

            db.collection('setup').insert({
                eula: true,
                lang: 'ru',
                styles: 1,
                a: 'a'
            });

            db.close();
        });

        MongoClient.connect('mongodb://localhost:27017/info', function(err, db){

            if (err) throw err;

            db.collection('brorecords').insert({
                ids_name : "Bro",
                date_reg : "2019-02-05",
                time_reg : "21-14-17",
                ip_src : "192.168.1.69",
                port_src : 25143,
                ip_dest : "87.250.247.183",
                port_dest : 443,
                protocol : "tcp",
                conn_quantity : 209,
                status : "good"
            });

            db.collection('dallaslockrecords').insert({
                ids_name : "Dallas Lock",
                date_reg : "18.02.2019",
                time_reg : "14:30:59",
                ip_src : "192.168.1.66",
                port_src : 63027,
                ip_dest : "192.168.1.35",
                port_dest : 23,
                protocol : "TCP",
                signatures : "(detektor atak)",
                conn_quantity : 1,
                status : "bad"
            });

            db.collection('secretnetrecords').insert({
                ids_name : "SecretNet",
                date_reg : "2019-02-04",
                time_reg : "12:44:19",
                ip_src : "192.168.1.47",
                port_src : 54585,
                ip_dest : "192.168.1.2",
                port_dest : 36804,
                protocol : "TCP",
                signatures : "S-1-5-21-2952462522-1152063880-525777333",
                conn_quantity : 1,
                status : "unknown"
            });

            db.collection('snortrecords').insert({
                ids_name : "Snort",
                date_reg : "2019-02-04",
                time_reg : "20:14:36",
                ip_src : "192.168.1.69",
                port_src : 2540,
                ip_dest : "209.197.3.15",
                port_dest : 443,
                protocol : "TCP",
                signatures : "[snort]",
                conn_quantity : 16,
                status : "good"
            });

            db.collection('suricatarecords').insert({
                ids_name : "Suricata",
                date_reg : "19:46:19",
                time_reg : "04/22/20",
                ip_src : "192.168.1.137",
                port_src : 57535,
                ip_dest : "82.165.177.154",
                port_dest : 80,
                protocol : "TCP",
                signatures : "(linux-gnu)",
                conn_quantity : 1,
                status : "unknown"
            });

            db.collection('uidsrecords').insert({
                ids_name : "?",
                date_reg : "17:36:08",
                time_reg : "2008-06-04",
                ip_src : "192.168.0.200",
                port_src : "54",
                ip_dest : "(dest. IP not found!)",
                port_dest : 0,
                protocol : "TCP",
                signatures : "xss csrf id rfe lfi",
                conn_quantity : 1,
                status : "good"
            });

            db.close();
        });
    }
}