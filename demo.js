function rangeText(start, end) {
    var str = '';
    str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
    str += end ? end.format('Do MMMM YYYY') : '...';

    return str;
}
// demo-1
new lightPick({
    field: document.getElementById('demo-1'),
    onSelect: function(date){
        document.getElementById('result-1').innerHTML = date.format('Do MMMM YYYY');
    }
});

// demo-2
new lightPick({
    field: document.getElementById('demo-2'),
    singleDate: false,
    onSelect: function(start, end){
        document.getElementById('result-2').innerHTML = rangeText(start, end);
    }
});

// demo-3
new lightPick({
    field: document.getElementById('demo-3_1'),
    secondField: document.getElementById('demo-3_2'),
    onSelect: function(start, end){
        document.getElementById('result-3').innerHTML = rangeText(start, end);
    }
});

// demo-4
new lightPick({
    field: document.getElementById('demo-4'),
    singleDate: false,
    numberOfMonths: 6,
    onSelect: function(start, end){
        document.getElementById('result-4').innerHTML = rangeText(start, end);
    }
});

// demo-5
new lightPick({
    field: document.getElementById('demo-5'),
    singleDate: false,
    numberOfColumns: 3,
    numberOfMonths: 6,
    onSelect: function(start, end){
        document.getElementById('result-5').innerHTML = rangeText(start, end);
    }
});

// demo-6
new lightPick({
    field: document.getElementById('demo-6'),
    singleDate: false,
    minDate: moment().startOf('month').add(7, 'day'),
    maxDate: moment().endOf('month').subtract(7, 'day'),
    onSelect: function(start, end){
        document.getElementById('result-6').innerHTML = rangeText(start, end);
    }
});

// demo-7
new lightPick({
    field: document.getElementById('demo-7'),
    singleDate: false,
    selectForward: true,
    onSelect: function(start, end){
        document.getElementById('result-7').innerHTML = rangeText(start, end);
    }
});

// demo-8
new lightPick({
    field: document.getElementById('demo-8'),
    singleDate: false,
    selectBackward: true,
    onSelect: function(start, end){
        document.getElementById('result-8').innerHTML = rangeText(start, end);
    }
});

// demo-9
new lightPick({
    field: document.getElementById('demo-9'),
    singleDate: false,
    minDays: 3,
    maxDays: 7,
    onSelect: function(start, end){
        document.getElementById('result-9').innerHTML = rangeText(start, end);
    }
});