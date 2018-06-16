lightPick
=========

Javascript date range picker - lightweight, no jQuery
-----------------------------------------------------
![screenshot](https://wakirin.github.io/lightPick.png)

### [Demo & Docs](https://wakirin.github.io/lightPick)

----

### Dependencies

* Moment.js

### Installation

* * *

```
npm install lightpick
```

or you can download and include Moment.js and lightPick files manually.

### Usage

* * *

lightPick can be bound to an input field:

```
<input type="text" id="lightpick"/>
```

Include lightPick script to the end of your document:

```
<script src="lightpick.js"></script>  
<script>  
var picker = new lightPick({ field: document.getElementById('datepicker') });  
</script>
```

### Configuration

* * *

`field` \- bind the datepicker to a form field

`secondField` \- if exists then end of date range will set here.

`firstDay` (number) default: 1 \- ISO day of the week (1: Monday, ..., 7: Sunday).

`parentEl` (string) default: 'body' \- selector of the parent element that the date range picker will be added to, if not provided this will be 'body'.

`lang` (string) default: 'auto' \- language code for names of days, months by [Date.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString). 'auto' will try detect user browser language.

`buttons` (object) default: { prev: '<', next: '>', close: '×'} \- text for buttons.

`format` (string) default: 'DD/MM/YYYY' \- the default output format.

`separator` (string) default: '-' \- separator between dates when one field.

`numberOfMonths` (number) default: 1 \- number of visible months.

`numberOfColumns` (number) default: 2 \- number of columns months.

`singleDate` (true/false) default: true \- choose a single date instead of a date range.

`autoclose` (true/false) default: true \- close calendar when picked date/range.

`minDate` (moment|string|number|date) default: null \- the minimum/earliest date that can be selected. Any format: moment() or '2018-06-01' or 1527811200000, new Date()

`maxDate` (moment|string|number|date) default: null \- the maximum/latest date that can be selected. Any format: moment() or '2018-06-01' or 1527811200000, new Date()

`disableDates` (array) default: null \- array of disabled dates. Array can contains ranges, allowed the same format as in options minDate, maxDate. Ex.: \[moment().startOf('month'), \['2018-06-23', '2018-06-30'\]\]

`selectForward` (true/false) default: false \- select second date after the first selected date.

`selectBackward` (true/false) default: false \- select second date before the first selected date.

`minDays` (number) default: null \- the minimum days of the selected range.

`maxDays` (number) default: null \- the maximum days of the selected range.

`onSelect` \- callback function for when a date is selected.

`onOpen` \- callback function for when the picker becomes visible.

`onClose` \- callback function for when the picker is hidden.

### Methods

* * *

`picker.setDate(date)`

Set date when singleDate is true. `date` can be moment, string, number, date.  
Ex. `picker.setDate(new Date());`

  
`picker.setDateRange(start, end)`

Set date range. <code>start, end</code> can be moment, string, number, date. 
Ex. `picker.setDateRange(new Date(), moment().add(7, 'day'));`
  

`picker.setDisableDates(array)`

array of disabled dates. Array can contains ranges, allowed moment, string, number, date.
Ex. `picker.setDisableDates([ moment().startOf('month'), ['2018-06-23', '2018-06-30'] ]);`


`picker.getDate()`

Return current date as moment object.


`picker.getStartDate()`

Return current start of date range as moment object.

  

`picker.getEndDate()`

Return current start of date range as moment object.

  

`picker.show()`

Make the picker visible.

  

`picker.hide()`

Hide the picker.

  

`picker.destroy()`

Hide the picker and remove all event listeners.