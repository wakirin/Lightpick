# Changelog
All notable changes to this project will be documented in this file.

[1.5.0] - 2019-11-12
* All getX methods returns clone dates now - PR #75 - Thanks @StevenGastroSophy

[1.4.5] - 2019-11-03
* Added onSelectStart and onSelectEnd helper functions - PR #61 - Thanks @scssyworks

[1.4.4] - 2019-11-03
* Fix autoclose refresh date issue - #74

[1.4.3] - 2019-11-01
* Fix reload options for dropdowns and locale objects

[1.4.2] - 2019-11-01
* SCSS file added - PR #72 - Thanks @tomvanenckevort

[1.4.1] - 2019-10-23
* Fix iOS daylight savings time weekdayName issue - PR #85 - Thanks @EionRobb

[1.4.0] - 2019-10-22
* Fix minDate, maxDate, disableDates and value (gotoDate) of input now respects format parameter.

[1.3.6] - 2019-10-22
* New options `onMonthsChange` and `onYearsChange` - Events fire when months or years select changed.
    `onMonthsChange` throws zero based number of month. Ex: January = 0
    `onYearsChange` throws year. Ex: 2019
    Implementation of #59
    
[1.3.5] - 2019-10-22
* New option `weekdayStyle` - Weekday display style added.
    Possible values are 'long', 'short' or 'narrow'.
    Implementation of #91

[1.3.4] - 2019-03-30
* fixed bug #51

[1.3.2] - 2019-03-25
* New option: `dropdowns` 

[1.3.1] - 2019-03-22
* New option: `inline` (default is `false`)

[1.3.0] - 2019-03-22
* Dropdown list months, years

[1.2.11] - 2019-02-13
* Improve sync values with fields

[1.2.10] - 2019-02-12
* fixed bug #36 

[1.2.9] - 2019-01-15
* fixed bugs #28, #29, #30

[1.2.8] - 2018-12-18
* improved option `orientation` (checking available space on top when value is `auto`)

[1.2.7] - 2018-12-10
* fix bug when used both options `repick` and `minDays` (on repick date `minDays` was ignored)

[1.2.6] - 2018-11-08
* new option: orientation
* new option: disableWeekends
* fixed bug #23

[1.2.5] - 2018-09-06
* Improve pluralize. Now as function.

[1.2.4] - 2018-08-26
* Tooltip on disabled days.

[1.2.3] - 2018-08-24
* Removed extra `div` days in next month.

[1.2.2] - 2018-08-24
* new callback: onError
  Calling when `disabledDatesInRange` is set to `false` and user is select range includes disabled dates.
* minor bug fixes

[1.2.0] - 2018-08-23
* new option: disabledDatesInRange
* new option: tooltipNights

[1.1.2] - 2018-08-22
* new option: footer

[1.1.1] - 2018-08-16
* fixed bug #15

[1.1.0] - 2018-07-20
* drop support IE
* now header (month name) is clickable for fast change month

[1.0.9] - 2018-07-19
* fixed bug #9

[1.0.8] - 2018-07-12
* new option `hideOnBodyClick` (by ninty9notout)
* fixed bug #7

[1.0.6] - 2018-07-12
* Improves styling (by bartvandebiezen)

[1.0.5] - 2018-07-12
* new method `reloadOptions` (by Codetaal)
* fixed bug #5

[1.0.4] - 2018-07-12
* Improves CSS (by bartvandebiezen)

[1.0.3] - 2018-07-09
* fixed bug #1: preventing pick a one-day-range when `minDays` option

[1.0.2] - 2018-06-20
* Added method `toString`

[1.0.0] - 2018-06-20
* Constructor name to begin with a capital letter: `lightPick` to `Lightpick`

[0.0.6] - 2018-06-20
* Added option `repick` 

[0.0.4] - 2018-06-18
* Added tooltip
* Option `buttons` moved to `locale`

[0.0.2] - 2018-06-16
* Added polyfill (Object.assign)
* flexbox fallback for IE
* Update docs

[0.0.1] - 2018-06-15
* Published on Github
