# IDS Parser

### WARNING!

This is **beta version** (just for demonstration), not for real work! Author is **not** responsible if something goes wrong ;)

### Screenshot

![Screenshot of the app (russian language)](https://i.imgur.com/0GTDabN.png "in russian")

### Functions

- Parses log files of well-known Intrusion Detection Systems (IDS), such as Snort, Dallas Lock, Zeek (ex. Bro), etc.
- Shows diagram of legal, illegal & unknown traffic
- Shows traffic description in human-readable format
- Can export all parsed information to PDF
- NOTE: demo log files also included in this repository (`demo` folder)

### Minimal browser requirements

| Name        | Version           | Platform  |
| ------------- |-------------| ---------------|
| Internet Explorer | 10        | Windows 7 SP1 |
| Edge              | 17        | Windows 10, build 1803 |
| Firefox           | 52.9      | Windows XP SP2/Ubuntu 14.04/Mac OS X 10.9 |
| Chrome            | 49        | Windows XP SP3/Ubuntu 14.04/Mac OS X 10.10 |
| Safari            | 5.1.7     | Windows XP SP3/Mac OS X 10.6 |
| Opera             | 36        | Windows XP SP3/ Ubuntu 16.04 (x64)/Mac OS X 10.10 |
| iOS Safari        | 11        | iOS 11.4 |
| Android Browser   | 67        | Android 6 |
| Chrome for Android | 71       | Android 4.1 |
| Firefox for Android | 64      | Android 4.1 |

### How to start

1. Make sure you have successfully connected to MongoDB database (usually *localhost:27017*).
2. Clone this repository where you need.
3. Run `npm i` command to download libraries for this app.
4. Run `nodemon` or `node index.js` command. When message *Parser was started, using port 3000* is shown, go to `http://localhost:3000/install` and follow all the instructions, after that go to `http://localhost:3000`.

### License

[GNU GPL v1.0](https://www.gnu.org/licenses/old-licenses/gpl-1.0.en.html)

### Copyright

&copy; [SIV](https://www.facebook.com/thesiv95), 2019

### Libraries & frameworks used

- [Stolzl-Regular](https://fonts.adobe.com/fonts/stolzl) Copyright &copy; 2015 by Mariya Pigoulevskaya. All rights reserved.

- [Font Awesome](https://fontawesome.com) (free license) &copy; 2017 Fonticons, Inc. - Icons — CC BY 4.0 License, Fonts — SIL OFL 1.1 License, Code — MIT License
- [jQuery 1.9.1](https://code.jquery.com/jquery/) &copy; 2013-2019 The jQuery Foundation - MIT License
- [jQuery File Upload v9.25.1](https://blueimp.github.io/jQuery-File-Upload/) &copy; 2019 Sebastian Tschan - MIT License
- [StyleFix 1.0.3 & PrefixFree 1.0.7](https://leaverou.github.io/prefixfree/) &copy; 2017 Lea Verou - MIT License
- [Modernizr 3.6.0](https://modernizr.com) &copy; 2019 Faruk Ateş, Paul Irish, Alex Sexton, Ryan Seddon, Patrick Kettner, Stu Cox, Richard Herrera - MIT License
- [Moment.js 2.24.0](https://momentjs.com) &copy; 2019 JS Foundation and other contributors - MIT License
- [d3.js 5.9.1](https://d3js.org) &copy; 2019 Mike Bostock - BSD license
- [d3pie 0.2.1](http://d3pie.org) &copy; 2014-2015 Benjamin Keen - MIT License
- [mongodb 2.2.33](https://mongodb.github.io/node-mongodb-native/2.2/) &copy; 2009-2012 Christian Amor Kvalheim, 2012-present MongoDB Contributors - Apache 2.0 License
- [xml2js 0.4.19](https://www.npmjs.com/package/xml2js) &copy; 2017 @Leonidas-from-XIV - MIT License
- [Twig 2.x](https://twig.symfony.com) &copy; 2010-2019 Symfony - BSD License
- [Twig 2.x - version for node.js](https://www.npmjs.com/package/twig)
- [Helmet 3.18.0](https://helmetjs.github.io) &copy; 2019 Adam Baldwin - CC 3.0 License
- [x-xss-protection 1.1.0](https://www.npmjs.com/package/x-xss-protection) &copy; 2019 Evan Hahn - MIT License
- [dont-sniff-mimetype 1.0.0](https://www.npmjs.com/package/dont-sniff-mimetype) &copy; 2019 Evan Hahn - MIT License
- [PDFKit](http://pdfkit.org/) &copy; @devongonett 2019 - MIT license
- [svg-to-pdfkit](https://github.com/alafr/SVG-to-PDFKit) &copy; @alafr 2019 - MIT license