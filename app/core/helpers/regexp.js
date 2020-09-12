// Library for including regular expressions

var regExp = { // В комментариях примеры выражений
    // General
    time: /(2[0-3]|[01]|[0-9]):?([0-5][0-9]):?([0-5][0-9])/i, // 20:10:48
    ip: /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/g, // 192.168.1.10
    protocol: /TCP|UDP|TLS/ig, // TCP
    quantity: /\#/g,
    // IDS Detection
    detectionSnort: /\[snort\]/g,
    detectionSecretNet: /eln\=\"Secret Net Studio\"/ig,
    detectionDallasLock: /\<Журнал\>|\<Запись\>/ig,
    detectionBro: /\#separator|_field|\#path|\#open|\#fields/ig,
    detectionSuricata: /\[\*\*\] \/ \[\*\*\]/ig,
    // Snort
    portSnort: /:([0-9]{1,5}\ )/g, // :12345
    dateSnort: /^(\t[0-9]{4})(-?)(1[0-2]|0[1-9])\2(3[01]|0[1-9]|[12][0-9])$/ig, // \t2019-02-04 (snort!)
    // [cve] [icat] [cve] [icat] [bugtraq] [bugtraq] [bugtraq] [snort] SNMP trap tcp
    signatureSnort: /\[snort\]/g, // #0-(1-24)
    signatureSecretNet: /S\-1\-5\-21\-([0-9]{10})\-([0-9]{10})\-([0-9]{10})/g, // S-1-5-21-2952462522-1152063880-525777333
    signatureDallasLock: '(детектор атак)',
    // BRO
    connectionIdBro: /([0-9]{10})\.([0-9]{6})/g, // 1549376052.027596
    portBro: /^([0-9]{1,5})$/g, // 12345
    signatureBro: /[\^A-Z0-9]{1,8}$/ig, // ^hCadfs
    signatureSuricata: 'linux-gnu',
    // SecretNet
    portSecretNet: /[0-9]{1,5}/g
};

// Возможность использовать объект в других файлах
module.exports = regExp;