// А здесь вызовем детектор, а также все функции - расщепители лог файлов!
var detector = require('./detector');
var Bro = require('./helpers/bro');
var DallasLock = require('./helpers/dallaslock');
var SecretNet = require('./helpers/secretnet');
var Snort = require('./helpers/snort');
var Suricata = require('./helpers/suricata');
var uIDS = require('./helpers/unknown_ids');

module.exports = {
    start: function(){
        switch (detector.detected){
            case 'Bro':
                Bro.extract();
                break;
            case 'Dallas Lock':
                DallasLock.extract();
                break;
            case 'SecretNet':
                SecretNet.extract();
                break;
            case 'Snort':
                Snort.extract();
                break;
            case 'Suricata':
                Suricata.extract();
                break;
            default:
                uIDS.extract();
                break;
        }
    }
}

 