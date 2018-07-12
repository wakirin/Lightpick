[![npm version](https://badge.fury.io/js/lightpick.svg)](https://www.npmjs.com/package/lightpick) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wakirin/lightpick/blob/master/LICENSE)



Lightpick
=========

Javascript date range picker - lightweight, no jQuery
-----------------------------------------------------
![screenshot](https://wakirin.github.io/Lightpick_new_style.gif)

## [Demo & Docs](https://wakirin.github.io/Lightpick)

----

## Dependencies

* Moment.js

## Installation

* * *

```
npm install lightpick
```

or you can download and include Moment.js and Lightpick files manually.

## Usage

* * *

Lightpick can be bound to an input field:

```
<input type="text" id="datepicker"/>
```

Include Lightpick script to the end of your document:

```
<script src="lightpick.js"></script>  
<script>  
var picker = new Lightpick({ field: document.getElementById('datepicker') });  
</script>
```

## Configuration

* * *

### field
- Type: `Element`
- Default: `null` 

Bind the datepicker to a form field

### secondField
- Type: `Element`
- Default: `null` 

If exists then end of date range will set here.

### firstDay
- Type: `Number`
- Default: `1`

ISO day of the week (1: Monday, ..., 7: Sunday).

### parentEl
- Type: `String`
- Default: `body` 

Selector of the parent element that the date range picker will be added to, if not provided this will be 'body'.

### lang
- Type: `String`
- Default: `auto`

Language code for names of days, months by [Date.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString). 'auto' will try detect user browser language.

### format
- Type: `String`
- Default: `DD/MM/YYYY`

The default output format.

### separator
- Type: `String`
- Default: `-`

Separator between dates when one field.

### numberOfMonths
- Type: `Number`
- Default: `1`

Number of visible months.

### numberOfColumns
- Type: `Number`
- Default: `2`

Number of columns months.

### singleDate
- Type: `Boolean`
- Default: `true`

Choose a single date instead of a date range.

### autoclose
- Type: `Boolean`
- Default: `true`

Close calendar when picked date/range.

### repick
- Type: `Boolean`
- Default: `false`

Repick start/end instead of new range. This option working only when exists `secondField`.

### minDate
- Type: `moment|String|Number|Date`
- Default: `null`

The minimum/earliest date that can be selected. Any format: moment() or '2018-06-01' or 1527811200000, new Date()

### maxDate
- Type: `moment|String|Number|Date`
- Default: `null`

The maximum/latest date that can be selected. Any format: moment() or '2018-06-01' or 1527811200000, new Date()

### disableDates
- Type: `Array`
- Default: `null`

Array of disabled dates. Array can contains ranges, allowed the same format as in options minDate, maxDate. Ex.: `\[moment().startOf('month'), \['2018-06-23', '2018-06-30'\]\]`

### selectForward
- Type: `Boolean`
- Default: `false`

Select second date after the first selected date.

### selectBackward
- Type: `Boolean`
- Default: `false`

Select second date before the first selected date.

### minDays
- Type: `Number`
- Default: `null`

The minimum days of the selected range.

### maxDays
- Type: `Number`
- Default: `null`

The maximum days of the selected range.

### locale
- Type: `Object`
- Default: `{ buttons: { prev: '<', next: '>', close: '×'}, tooltip: ['day', 'days'] }`

Text for buttons, tooltip.

### onSelect
- Type: `Function`
- Default: `null`

Callback function for when a date is selected.

### onOpen
- Type: `Function`
- Default: `null`

Callback function for when the picker becomes visible.

### onClose
- Type: `Function`
- Default: `null`

Callback function for when the picker is hidden.

## Methods

* * *

### picker.setDate(date)

Set date when singleDate is true. `date` can be moment, string, number, date.  
Ex. `picker.setDate(new Date());`

  
### picker.setDateRange(start, end)

Set date range. <code>start, end</code> can be moment, string, number, date. 
Ex. `picker.setDateRange(new Date(), moment().add(7, 'day'));`
  

### picker.setDisableDates(array)

array of disabled dates. Array can contains ranges, allowed moment, string, number, date.
Ex. `picker.setDisableDates([ moment().startOf('month'), ['2018-06-23', '2018-06-30'] ]);`


### picker.getDate()

Return current date as moment object.

### picker.getStartDate()

Return current start of date range as moment object.

### picker.getEndDate()

Return current start of date range as moment object.

### picker.toString('YYYY-MM-DD')

Returns the date in a string format. 

### picker.reloadOptions({})

Update picker options.

### picker.show()

Make the picker visible.

### picker.hide()

Hide the picker.

### picker.destroy()

Hide the picker and remove all event listeners.