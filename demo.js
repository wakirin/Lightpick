var rangeText = function (start, end) {
        var str = '';
        str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
        str += end ? end.format('Do MMMM YYYY') : '...';

        return str;
    },
    css = function(url){
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        head.appendChild(link);
    },
    script = function (url) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = url;
        var head  = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }
    callbackJson = function(json){
        var id = json.files[0].replace(/\D/g,'');
        document.getElementById('gist-' + id).innerHTML = json.div;

        if (!document.querySelector('link[href="' + json.stylesheet  + '"]')) {
            css(json.stylesheet);
        }
    };


window.onload = function () {
    var gists = [
        'https://gist.github.com/wakirin/c0100ee7e886fe74b3256ddb74f16adf.json?callback=callbackJson',
        'https://gist.github.com/wakirin/d4f00465b259590233f0727f01eaba66.json?callback=callbackJson',
        'https://gist.github.com/wakirin/c4e84bf9c5546a9656337236491a75f6.json?callback=callbackJson',
        'https://gist.github.com/wakirin/cdc9423464346f2de381cb3df0c78860.json?callback=callbackJson',
        'https://gist.github.com/wakirin/917c0e596078c1fcf51bff945004a4f2.json?callback=callbackJson',
        'https://gist.github.com/wakirin/4b9917aa9bda42f25124875c91385c7f.json?callback=callbackJson',
        'https://gist.github.com/wakirin/8782b1f9e3580a26fb70cdc78c4ed6d3.json?callback=callbackJson',
        'https://gist.github.com/wakirin/a76eaf1f7860aa0add9ba384bec8e0aa.json?callback=callbackJson',
        'https://gist.github.com/wakirin/b526e49275dc02c4ab3f3b72c3f0f3af.json?callback=callbackJson',
        'https://gist.github.com/wakirin/8fdf443726f097326d927e0e85dbc5dd.json?callback=callbackJson',
        'https://gist.github.com/wakirin/a10bbe7a2d22d1c285cd4763e4a5de80.json?callback=callbackJson',
    ];

    if (!window.location.href.startsWith('file')) {
        gists.forEach(function(entry, key){
            script(entry);
        });
    }
};

// demo-1
new Lightpick({
    field: document.getElementById('demo-1'),
    onSelect: function(date){
        document.getElementById('result-1').innerHTML = date.format('Do MMMM YYYY');
    }
});

// demo-2
new Lightpick({
    field: document.getElementById('demo-2'),
    singleDate: false,
    onSelect: function(start, end){
        document.getElementById('result-2').innerHTML = rangeText(start, end);
    }
});

// demo-3
new Lightpick({
    field: document.getElementById('demo-3_1'),
    secondField: document.getElementById('demo-3_2'),
    onSelect: function(start, end){
        document.getElementById('result-3').innerHTML = rangeText(start, end);
    }
});

// demo-4
new Lightpick({
    field: document.getElementById('demo-4'),
    singleDate: false,
    numberOfMonths: 6,
    onSelect: function(start, end){
        document.getElementById('result-4').innerHTML = rangeText(start, end);
    }
});

// demo-5
new Lightpick({
    field: document.getElementById('demo-5'),
    singleDate: false,
    numberOfColumns: 3,
    numberOfMonths: 6,
    onSelect: function(start, end){
        document.getElementById('result-5').innerHTML = rangeText(start, end);
    }
});

// demo-6
new Lightpick({
    field: document.getElementById('demo-6'),
    singleDate: false,
    minDate: moment().startOf('month').add(7, 'day'),
    maxDate: moment().endOf('month').subtract(7, 'day'),
    onSelect: function(start, end){
        document.getElementById('result-6').innerHTML = rangeText(start, end);
    }
});

// demo-7
new Lightpick({
    field: document.getElementById('demo-7'),
    singleDate: false,
    selectForward: true,
    onSelect: function(start, end){
        document.getElementById('result-7').innerHTML = rangeText(start, end);
    }
});

// demo-8
new Lightpick({
    field: document.getElementById('demo-8'),
    singleDate: false,
    selectBackward: true,
    onSelect: function(start, end){
        document.getElementById('result-8').innerHTML = rangeText(start, end);
    }
});

// demo-9
new Lightpick({
    field: document.getElementById('demo-9'),
    singleDate: false,
    minDays: 3,
    maxDays: 7,
    onSelect: function(start, end){
        document.getElementById('result-9').innerHTML = rangeText(start, end);
    }
});

// demo-10
var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

var relativeTimeWithPlural = function (number, withoutSuffix, key) {
    var format = {
        'ss': withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
        'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
        'hh': 'час_часа_часов',
        'dd': 'день_дня_дней',
        'MM': 'месяц_месяца_месяцев',
        'yy': 'год_года_лет'
    };

    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }

    return number + ' ' + plural$4(format[key], +number);
}

new Lightpick({
    field: document.getElementById('demo-10'),
    singleDate: false,
    lang: 'ru',
    locale: {
        tooltip: {
            one: 'день',
            few: 'дня',
            many: 'дней',
        },
        pluralize: function(i, locale) {
            if ('one' in locale && i % 10 === 1 && !(i % 100 === 11)) return locale.one;
            if ('few' in locale && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) return locale.few;
            if ('many' in locale && (i % 10 === 0 || i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14)) return locale.many;
            if ('other' in locale) return locale.other;

            return '';
        },
        moment: [{
            name: 'ru',
            config: {
                months : {
                    format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
                    standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
                },
                monthsShort : {
                    format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
                    standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
                },
                weekdays : {
                    standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
                    format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
                    isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
                },
                weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
                weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
                monthsParse : monthsParse,
                longMonthsParse : monthsParse,
                shortMonthsParse : monthsParse,
                monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
                monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
                monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
                monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
                longDateFormat : {
                    LT : 'H:mm',
                    LTS : 'H:mm:ss',
                    L : 'DD.MM.YYYY',
                    LL : 'D MMMM YYYY г.',
                    LLL : 'D MMMM YYYY г., H:mm',
                    LLLL : 'dddd, D MMMM YYYY г., H:mm'
                },
                calendar : {
                    sameDay: '[Сегодня, в] LT',
                    nextDay: '[Завтра, в] LT',
                    lastDay: '[Вчера, в] LT',
                    nextWeek: function (now) {
                        if (now.week() !== this.week()) {
                            switch (this.day()) {
                                case 0:
                                    return '[В следующее] dddd, [в] LT';
                                case 1:
                                case 2:
                                case 4:
                                    return '[В следующий] dddd, [в] LT';
                                case 3:
                                case 5:
                                case 6:
                                    return '[В следующую] dddd, [в] LT';
                            }
                        } else {
                            if (this.day() === 2) {
                                return '[Во] dddd, [в] LT';
                            } else {
                                return '[В] dddd, [в] LT';
                            }
                        }
                    },
                    lastWeek: function (now) {
                        if (now.week() !== this.week()) {
                            switch (this.day()) {
                                case 0:
                                    return '[В прошлое] dddd, [в] LT';
                                case 1:
                                case 2:
                                case 4:
                                    return '[В прошлый] dddd, [в] LT';
                                case 3:
                                case 5:
                                case 6:
                                    return '[В прошлую] dddd, [в] LT';
                            }
                        } else {
                            if (this.day() === 2) {
                                return '[Во] dddd, [в] LT';
                            } else {
                                return '[В] dddd, [в] LT';
                            }
                        }
                    },
                    sameElse: 'L'
                },
                relativeTime : {
                    future : 'через %s',
                    past : '%s назад',
                    s : 'несколько секунд',
                    ss : relativeTimeWithPlural,
                    m : relativeTimeWithPlural,
                    mm : relativeTimeWithPlural,
                    h : 'час',
                    hh : relativeTimeWithPlural,
                    d : 'день',
                    dd : relativeTimeWithPlural,
                    M : 'месяц',
                    MM : relativeTimeWithPlural,
                    y : 'год',
                    yy : relativeTimeWithPlural
                },
                meridiemParse: /ночи|утра|дня|вечера/i,
                isPM : function (input) {
                    return /^(дня|вечера)$/.test(input);
                },
                meridiem : function (hour, minute, isLower) {
                    if (hour < 4) {
                        return 'ночи';
                    } else if (hour < 12) {
                        return 'утра';
                    } else if (hour < 17) {
                        return 'дня';
                    } else {
                        return 'вечера';
                    }
                },
                dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
                ordinal: function (number, period) {
                    switch (period) {
                        case 'M':
                        case 'd':
                        case 'DDD':
                            return number + '-й';
                        case 'D':
                            return number + '-го';
                        case 'w':
                        case 'W':
                            return number + '-я';
                        default:
                            return number;
                    }
                },
                week : {
                    dow : 1,
                    doy : 4
                }
            }
        }]
    },
    onSelect: function(start, end){
        document.getElementById('result-10').innerHTML = rangeText(start, end);
    }
});

// demo-11
new Lightpick({
    field: document.getElementById('demo-11_1'),
    secondField: document.getElementById('demo-11_2'),
    repick: true,
    startDate: moment().startOf('month').add(7, 'day'),
    endDate: moment().add(1, 'month').endOf('month').subtract(7, 'day'),
    onSelect: function(start, end){
        document.getElementById('result-11').innerHTML = rangeText(start, end);
    }
});

// demo-12
new Lightpick({
    field: document.getElementById('demo-12'),
    singleDate: false,
    numberOfMonths: 2,
    footer: true,
    onSelect: function(start, end){
        document.getElementById('result-12').innerHTML = rangeText(start, end);
    }
});
