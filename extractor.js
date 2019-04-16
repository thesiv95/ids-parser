// А здесь вызовем детектор, а также все функции - расщепители лог файлов!
var detector = require('./detector');
var Bro = require('./bro');
var DallasLock = require('./dallaslock');
var SecretNet = require('./secretnet');
var Snort = require('./snort');
var Suricata = require('./suricata');
var uIDS = require('./unknown_ids');


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
 