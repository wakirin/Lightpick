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
        }
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

// demo-13
new Lightpick({
    field: document.getElementById('demo-13'),
    inline: true,
    onSelect: function(date){
        document.getElementById('result-13').innerHTML = date.format('Do MMMM YYYY');
    }
});