// А здесь вызовем детектор, а также все функции - расщепители лог файлов!
var detector = require('./detector');
// var Bro = require('./bro');
var DallasLock = require('./dallaslock');

switch (detector.detected){
    case 'Bro':
        console.log('Bro');
        break;
    case 'Dallas Lock':
    
        console.log('Dallas Lock');
        break;
    case 'SecretNet':
        console.log('SecretNet');
        break;
    case 'Snort':
        console.log('Snort');
        break;
    case 'Suricata':
        console.log('Suricata');
        break;
    default:
        console.log('unknown IDS');
        break;
}