
/*
* not for production !!!
*/

// var tre = /(2[0-3]|[01]|[0-9]):?([0-5][0-9]):?([0-5][0-9])/i;
// var ipe = /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/;
var portr = /([0-9]{1,5})/;

var test = '#0-(1-24) 	[snort] COMMUNITY SIP TCP/IP message flooding directed to SIP proxy 	2019-02-04 20:14:36 	192.168.1.69:2540 	209.197.3.15:443 	TCP';

if(test.match(portr)) {
    console.log('ok');
}


// Заголовок  описания.  Основное  заглавие [общее  обозначение 
// материала] / Сведения  об  ответственности (авторы,  составители, 
//     редакторы, переводчики). – Место издания : Издательство, Год из-
//     дания. – Объем. 

// Регулярные выражения. Сборник рецептов, 2-е издание. / Гойвертс Я., Левитан С. - Пер. с англ. - СПб: Символ-Плюс, 2015. - 704 с., ил.
    


// var ids = ''; // switch-case test
// var idsDetect = "Forpost"; // @todo ids detection module
// var isBlob = true; // just for test [1]
// // @todo Convert module
// var isOK = true; // just for test [2]

// switch (idsDetect) {
//     case "Snort": 
//         ids = "Snort 2.9.2";
//         console.log("@todo: Converter TXT");
//         break;
//     case "Dallas Lock": 
//         ids = "Dallas Lock 8.0K";
//         console.log("@todo: Converter Blob-TXT");
//         break;
//     case "SecretNet":
//         ids = "SecretNet 8.4";
//         console.log("@todo: Converter XML-TXT");
//         break;
//     case "Suricata": 
//         ids = "Suricata 4.1.2";
//         console.log("@todo: Converter TXT");
//         break;
//     case "Bro":
//         ids = "Bro (Zeek) 2.6.1";
//         console.log("@todo: Converter TXT");
//         break;
//     default: 
//         ids = "Неизвестно";
//         if (isBlob) {
//             console.log("@todo: Converter Blob-TXT");
//         }
// }
// console.log("СОВ: " + ids);
// console.log("@todo: RegExp + count[data]");
// if (isOK) {
//     console.log("@todo: ОТРИСОВАТЬ Converter Blob-TXT");
// } else {
//     console.log("=== throw error ===");
// }



// /*

//  времена атак, адреса источников и назначения, их порты, протоколы и сигнатуры



// */