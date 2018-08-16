/**
* @author: Rinat G. http://coding.kz
* @copyright: Copyright (c) 2018 Rinat G.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
*/

// Following the UMD template https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Make globaly available as well
        define(['moment'], function (moment) {
            return factory(moment);
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node / Browserify
        var moment = (typeof window != 'undefined' && typeof window.moment != 'undefined') ? window.moment : require('moment');
        module.exports = factory(moment);
    } else {
        // Browser globals
        root.Lightpick = factory(root.moment);
    }
}(this, function(moment) {
    'use strict';

    var document = window.document,

    defaults = {
        field: null,
        secondField: null,
        firstDay: 1,
        parentEl: 'body',
        lang: 'auto',
        format: 'DD/MM/YYYY',
        separator: ' - ',
        numberOfMonths: 1,
        numberOfColumns: 2,
        singleDate: true,
        autoclose: true,
        adaptive: true,
        animation: {
            in: ['animated', 'slideInUp'],
            out: ['animated', 'slideOutDown']
        },
        repick: false,
        startDate: null,
        endDate: null,
        minDate: null,
        maxDate: null,
        disableDates: null,
        selectForward: false,
        selectBackward: false,
        minDays: null,
        maxDays: null,
        onSelect: null,
        onOpen: null,
        onClose: null,
        hoveringTooltip: true,
        hideOnBodyClick: true,
        locale: {
            buttons: {
                prev: '&leftarrow;',
                next: '&rightarrow;',
                close: '&times;',
            },
            tooltip: ['day', 'days'],
        }
    },

    isArray = function(item)
    {
        return item instanceof Array || Object.prototype.toString.call(item) === '[object Array]';
    },
    
    isObject = function(item) {
        return item instanceof Object || Object.prototype.toString.call(item) === '[object Object]';
    },

    renderTopButtons = function(opts, viewMode)
    {
        return '<div class="lightpick__toolbar">'
            + ''
            + '<button type="button" class="lightpick__previous-action" data-view-mode="' + viewMode + '">' + opts.locale.buttons.prev + '</button>'
            + '<button type="button" class="lightpick__next-action" data-view-mode="' + viewMode + '">' + opts.locale.buttons.next + '</button>'
            + (!opts.autoclose || (opts.adaptive && isMobile()) ? '<button type="button" class="lightpick__close-action">' + opts.locale.buttons.close + '</button>'  : '')
            + '</div>';
    },

    weekdayName = function(opts, day, short)
    {
        return new Date(1970, 0, day).toLocaleString(opts.lang, { weekday: short ? 'short' : 'long' })
    },

    renderDay = function(opts, date, dummy, extraClass)
    {
        if (dummy) return '<div></div>';

        var date = moment(date),
            prevMonth = moment(date).subtract(1, 'month'),
            nextMonth = moment(date).add(1, 'month');

        var day = {
            time: moment(date).valueOf(),
            className: ['lightpick__day', 'is-available']
        };

        if (isArray(extraClass)) {
            extraClass = extraClass.filter( function( el ) {
                return ['is-start-date', 'is-in-range', 'is-end-date', 'is-disabled', 'is-flipped'].indexOf( el ) < 0;
            });
            day.className = day.className.concat(extraClass);
        }
        else {
            day.className.push(extraClass);
        }

        if (opts.minDays && opts.startDate && !opts.endDate) {
            if (
                date.isBetween(moment(opts.startDate).subtract(opts.minDays - 1, 'day'), moment(opts.startDate).add(opts.minDays - 1, 'day'), 'day')
            ) {
                day.className.push('is-disabled');
            }
        }

        if (opts.maxDays && opts.startDate && !opts.endDate) {
            if (date.isSameOrBefore(moment(opts.startDate).subtract(opts.maxDays, 'day'), 'day')) {
                day.className.push('is-disabled');
            }
            else if (date.isSameOrAfter(moment(opts.startDate).add(opts.maxDays, 'day'), 'day')) {
                day.className.push('is-disabled');
            }
        }

        if (date.isSame(new Date(), 'day')) {
            day.className.push('is-today');
        }

        if (date.isSame(opts.startDate, 'day')) {
            day.className.push('is-start-date');
        }

        if (date.isSame(opts.endDate, 'day')) {
            day.className.push('is-end-date');
        }

        if (opts.startDate && opts.endDate && date.isBetween(opts.startDate, opts.endDate, 'day', '[]')) {
            day.className.push('is-in-range');
        }

        if (moment().isSame(date, 'month')) {

        }
        else if (prevMonth.isSame(date, 'month')) {
            day.className.push('is-previous-month');
        }
        else if (nextMonth.isSame(date, 'month')) {
            day.className.push('is-next-month');
        }

        if (opts.minDate && date.isBefore(opts.minDate, 'day')) {
            day.className.push('is-disabled');
        }

        if (opts.maxDate && date.isAfter(opts.maxDate, 'day')) {
            day.className.push('is-disabled');
        }

        if (opts.selectForward && !opts.singleDate && opts.startDate && !opts.endDate && date.isBefore(opts.startDate, 'day')) {
            day.className.push('is-disabled');
        }

        if (opts.selectBackward && !opts.singleDate && opts.startDate && !opts.endDate && date.isAfter(opts.startDate, 'day')) {
            day.className.push('is-disabled');
        }

        if (opts.disableDates) {
            for (var i = 0; i < opts.disableDates.length; i++) {
                if (isArray(opts.disableDates[i])) {
                    if (moment(opts.disableDates[i][0]).isValid()
                        && moment(opts.disableDates[i][1]).isValid()
                        && date.isBetween(moment(opts.disableDates[i][0]), moment(opts.disableDates[i][1]), 'day', '[]')){

                        day.className.push('is-disabled');

                    }
                }
                else if (moment(opts.disableDates[i]).isValid() && moment(opts.disableDates[i]).isSame(date, 'day')) {
                    day.className.push('is-disabled');
                }

                if (day.className.indexOf('is-disabled') >= 0) {
                    if (day.className.indexOf('is-start-date') >= 0) {
                        this.setStartDate(null);
                        this.setEndDate(null);
                    }
                    else if (day.className.indexOf('is-end-date') >= 0) {
                        this.setEndDate(null);
                    }
                }
            }
        }

        day.className = day.className.filter(function(value, index, self) {
            return self.indexOf(value) === index;
        });

        if (day.className.indexOf('is-disabled') >= 0 && day.className.indexOf('is-available') >= 0) {
            day.className.splice(day.className.indexOf('is-available'), 1);
        }

        var div = document.createElement('div');
        div.className = day.className.join(' ');
        div.innerHTML = date.get('date');
        div.setAttribute('data-time', day.time);

        return div.outerHTML;
    },

    renderCalendar = function(el, opts) 
    {
        var html = '',
            monthDate = moment(opts.calendar[0]);

        for (var i = 0; i < opts.numberOfMonths; i++) {
            var day = moment(monthDate);

            html += '<section class="lightpick__month">';
            html += '<header class="lightpick__month-title-bar">'
            html += '<h1 class="lightpick__month-title" data-ym="' + day.format('YYYY-MM') + '">' 
            + '<b class="lightpick__month-title-accent">' + day.toDate().toLocaleString(opts.lang, { month: 'long' }) + '</b> ' 
            + day.format('YYYY')  
            + '</h1>';

            html += '</header>'; // lightpick__month-title-bar

            html += '<div class="lightpick__days-of-the-week">';
            for (var w = opts.firstDay + 4; w < 7 + opts.firstDay + 4; ++w) {
                html += '<div class="lightpick__day-of-the-week" title="' + weekdayName(opts, w) + '">' + weekdayName(opts, w, true) + '</div>';
            }
            html += '</div>'; // lightpick__days-of-the-week

            html += '<div class="lightpick__days">';

            if (day.isoWeekday() !== opts.firstDay) {
                var prevDays = day.isoWeekday() - opts.firstDay > 0 ? day.isoWeekday() - opts.firstDay : day.isoWeekday(),
                    prevMonth = moment(day).subtract(prevDays, 'day'),
                    daysInMonth = prevMonth.daysInMonth();

                for (var d = prevMonth.get('date'); d <= daysInMonth; d++) {
                    html += renderDay(opts, prevMonth, i > 0, 'is-previous-month');

                    prevMonth.add(1, 'day');
                }
            }

            var daysInMonth = day.daysInMonth(),
                today = new Date();

            for (var d = 0; d < daysInMonth; d++) {
                html += renderDay(opts, day);

                day.add(1, 'day');
            }

            var nextMonth = moment(day),
                nextDays = 7 - nextMonth.isoWeekday() + opts.firstDay;

            for (var d = nextMonth.get('date'); d <= nextDays; d++) {
                html += renderDay(opts, nextMonth, i < opts.numberOfMonths - 1, 'is-next-month');

                nextMonth.add(1, 'day');
            }

            html += '</div>'; // lightpick__days

            html += '</section>'; // lightpick__month

            monthDate.add(1, 'month');
        }

        opts.calendar[1] = moment(monthDate);

        el.querySelector('.lightpick__months').innerHTML = html;
    },

    renderMonthsOfYear = function(el, opts, date)
    {
        if (date) {
            opts.calendar[0] = moment(date);
        }
        var ym = moment(opts.calendar[0]);

        var html = '<header class="lightpick__month-title-bar">'
        html += '<h1 class="lightpick__month-title">' + ym.format('YYYY') +  '</h1>';
        html += renderTopButtons(opts, 'months');
        html += '</header>';

        html += '<div class="lightpick__months-of-the-year-list">';

        for (var i = 1; i <= 12; i++) {
            html += '<div class="lightpick__month-of-the-year" data-goto-month="' + ym.format('YYYY') + '-' + i + '">' 
                 + '<div>' + moment(i, 'M').toDate().toLocaleString(opts.lang, { month: 'long' }) + '</div>'
                 + '<div>' + ym.format('YYYY') + '</div>' 
                 + '</div>';
        }
        html += '</div>';

        el.querySelector('.lightpick__months-of-the-year').innerHTML = html;
    },

    updateDates = function(el, opts)
    {
        [...el.querySelectorAll('.lightpick__day')].forEach(function(day) {
            day.outerHTML = renderDay(opts, parseInt(day.getAttribute('data-time')), false, day.className.split(' '));
        });
    },

    plural = function(value, arr) 
    {
        return value % 10 == 1 && value % 100 != 11
        ? arr[0]
        : (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20 ) ? arr[1] : (arr[2] || arr[1]));
    },

    isMobile = function()
    {
        // http://detectmobilebrowsers.com/
        var check = false;
        (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))  check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    },

    Lightpick = function(options)
    {
        var self = this,
            opts = self.config(options);

        self.el = document.createElement('section');

        self.el.className = 'lightpick lightpick--' + opts.numberOfColumns + '-columns is-hidden';

        if (opts.parentEl !== 'body') {
            self.el.className += ' lightpick--inlined';
        }

        if (opts.adaptive && isMobile()) {
            self.el.className += ' lightpick--adaptive';
        }

        self.el.innerHTML = '<div class="lightpick__inner">'
        + renderTopButtons(opts, 'days')
        + '<div class="lightpick__months"></div>'
        + '<div class="lightpick__tooltip" style="visibility: hidden"></div>'
        + '<div class="lightpick__months-of-the-year"></div>'
        + '</div>';

        document.querySelector(opts.parentEl).appendChild(self.el);

        self._onMouseDown = function(e)
        {
            if (!self.isShowing) {
                return;
            }

            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            if (target.classList.contains('lightpick__day') && target.classList.contains('is-available')) {

                if (self._opts.singleDate || (!self._opts.startDate && !self._opts.endDate) || (self._opts.startDate && self._opts.endDate)) {

                    if (self._opts.repick && self._opts.startDate && self._opts.endDate) {
                        if (self._opts.repickTrigger === self._opts.field) {
                            self.setStartDate(moment(parseInt(target.getAttribute('data-time'))));
                            target.classList.add('is-start-date');
                        }
                        else {
                            self.setEndDate(moment(parseInt(target.getAttribute('data-time'))));
                            target.classList.add('is-end-date');
                        }

                        if (self._opts.startDate.isAfter(self._opts.endDate)) {
                            self.swapDate();
                        }

                        if (self._opts.autoclose) {
                            setTimeout(function() {
                                self.hide();
                            }, 100);
                        }
                    }
                    else {
                        self.setStartDate(moment(parseInt(target.getAttribute('data-time'))));
                        self.setEndDate(null);

                        target.classList.add('is-start-date');

                        if (self._opts.singleDate && self._opts.autoclose) {
                            setTimeout(function() {
                                self.hide();
                            }, 100);
                        }
                        else if (!self._opts.singleDate) {
                            updateDates(self.el, self._opts);
                        }
                    }
                }
                else if (self._opts.startDate && !self._opts.endDate) {
                    self.setEndDate(moment(parseInt(target.getAttribute('data-time'))));

                    if (self._opts.startDate.isAfter(self._opts.endDate)) {
                        self.swapDate();
                    }

                    target.classList.add('is-end-date');

                    if (self._opts.autoclose) {
                        setTimeout(function() {
                            self.hide();
                        }, 100);
                    }
                    else {
                        updateDates(self.el, self._opts);
                    }
                }
            }
            else if (target.classList.contains('lightpick__previous-action')) {
                if (target.hasAttribute('data-view-mode')) {
                    var viewMode = target.getAttribute('data-view-mode');

                    switch (viewMode) {
                        case 'days':
                            self.prevMonth();
                        break;

                        case 'months':
                            self.prevYear();
                        break;
                    }
                }
            }
            else if (target.classList.contains('lightpick__next-action')) {
                if (target.hasAttribute('data-view-mode')) {
                    var viewMode = target.getAttribute('data-view-mode');

                    switch (viewMode) {
                        case 'days':
                            self.nextMonth();
                        break;

                        case 'months':
                            self.nextYear();
                        break;
                    }
                }
            }
            else if (target.classList.contains('lightpick__close-action')) {
                self.hide();
            }
            else if (target.classList.contains('lightpick__month-title')) {
                if (target.hasAttribute('data-ym')) {
                    var _toolbar = self.el.querySelector('.lightpick__inner > .lightpick__toolbar');
                    if (_toolbar) {
                        _toolbar.style.display = 'none';
                    }

                    self.el.querySelector('.lightpick__months').innerHTML = '';
                    renderMonthsOfYear(self.el, self._opts, target.getAttribute('data-ym'));
                }
            }
            else if (target.hasAttribute('data-goto-month')) {
                var month = moment(target.getAttribute('data-goto-month'), 'YYYY-M');
                if (month.isValid()) {
                    self.gotoDate(month);

                    self.el.querySelector('.lightpick__months-of-the-year').innerHTML = '';

                    var _toolbar = self.el.querySelector('.lightpick__inner > .lightpick__toolbar');
                    if (_toolbar) {
                        _toolbar.style.display = 'flex';
                    }
                }
            }

        };
        self._onMouseEnter = function(e)
        {
            if (!self.isShowing) {
                return;
            }

            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            var opts = self._opts;

            if (opts.singleDate || (!opts.startDate && !opts.endDate)) {
                return;
            }

            if (!target.classList.contains('lightpick__day') && !target.classList.contains('is-available')) {
                return;
            }

            if ((opts.startDate && !opts.endDate) || opts.repick) {
                var hoverDate = moment(parseInt(target.getAttribute('data-time')));

                if (!hoverDate.isValid()) {
                    return;
                }

                var startDate = (opts.startDate && !opts.endDate) || (opts.repick && opts.repickTrigger === opts.secondField) ? opts.startDate : opts.endDate;

                [...self.el.querySelectorAll('.lightpick__day')].forEach(function(day) {
                    var dt = moment(parseInt(day.getAttribute('data-time')));

                    day.classList.remove('is-flipped');

                    if (dt.isValid() && dt.isSameOrAfter(startDate, 'day') && dt.isSameOrBefore(hoverDate, 'day')) {
                        day.classList.add('is-in-range');

                        if (opts.repickTrigger === opts.field && dt.isSameOrAfter(opts.endDate)) {
                            day.classList.add('is-flipped');
                        }
                    }
                    else if (dt.isValid() && dt.isSameOrAfter(hoverDate, 'day') && dt.isSameOrBefore(startDate, 'day')) {
                        day.classList.add('is-in-range');

                        if (opts.repickTrigger !== opts.field) {
                            day.classList.add('is-flipped');
                        }
                    }
                    else {
                        day.classList.remove('is-in-range');
                    }

                    if (opts.startDate && opts.endDate && opts.repick && opts.repickTrigger === opts.field) {
                        day.classList.remove('is-start-date');
                    }
                    else {
                        day.classList.remove('is-end-date');
                    }
                });

                if (opts.hoveringTooltip) {
                    var days = Math.abs(hoverDate.isAfter(startDate) ? hoverDate.diff(startDate, 'day') : startDate.diff(hoverDate, 'day')) + 1;

                    var tooltip = self.el.querySelector('.lightpick__tooltip');

                    if (days > 0 && !target.classList.contains('is-disabled')) {
                            var hasParentEl = self.el.classList.contains('lightpick--inlined'),
                                dayBounding = target.getBoundingClientRect(),
                                pickerBouding = hasParentEl ? self.el.parentNode.getBoundingClientRect() : self.el.getBoundingClientRect(),
                                _left = (dayBounding.left - pickerBouding.left) + (dayBounding.width / 2),
                                _top = dayBounding.top - pickerBouding.top;

                        tooltip.style.visibility = 'visible';
                        tooltip.textContent = days + ' ' + plural(days, opts.locale.tooltip);

                        var tooltipBounding = tooltip.getBoundingClientRect();

                        _top -= tooltipBounding.height;
                        _left -= (tooltipBounding.width / 2);

                        setTimeout(function(){
                            tooltip.style.top = _top + 'px';
                            tooltip.style.left = _left + 'px';
                        }, 10);
                    }
                    else {
                        tooltip.style.visibility = 'hidden';
                    }
                }

                if (opts.startDate && opts.endDate && opts.repick && opts.repickTrigger === opts.field) {
                    target.classList.add('is-start-date');
                }
                else {
                    target.classList.add('is-end-date');
                }
            }
        };
        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (target.classList.contains('is-selected-lightpick-month')) {
                self.gotoMonth(target.value);
            }
            else if (target.classList.contains('is-selected-lightpick-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onInputChange = function(e)
        {
            var target = e.target || e.srcElement;

            if (self._opts.singleDate) {
                if (!self._opts.autoclose) {
                    self.gotoDate(opts.field.value);
                }

                self.setStartDate(opts.field.value);
            }

            if (!self.isShowing) {
                self.show();
            }
        };

        self._onInputFocus = function(e)
        {
            var target = e.target || e.srcElement;

            self.show(target);
        };

        self._onInputClick = function(e)
        {
            var target = e.target || e.srcElement;

            self.show(target);
        };

        self._onClick = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                parentEl = target;

            if (!target) {
                return;
            }

            do {
                if ((parentEl.classList && parentEl.classList.contains('lightpick')) || parentEl === opts.field || (opts.secondField && parentEl === opts.secondField)) {
                    return;
                }
            }
            while ((parentEl = parentEl.parentNode));

            if (self.isShowing && opts.hideOnBodyClick && target !== opts.field && parentEl !== opts.field) {
                self.hide();
            }
        };
        
        self.animationIn = function()
        {
            if (!opts.adaptive || !isMobile()) return;

            var _animationIn = opts.animation.in,
                _animationOut = opts.animation.out;

            if (_animationOut) {
                self.el.classList.remove(..._animationOut);
            }

            if (_animationIn) {
                self.el.classList.add(..._animationIn);
            }
        },

        self.animationOut = function()
        {
            if (!opts.adaptive || !isMobile()) {
                self.el.classList.add('is-hidden');
                return;
            }

            var _animationIn = opts.animation.in,
                _animationOut = opts.animation.out;

            if (_animationIn) {
                self.el.classList.remove(..._animationIn);
            }

            if (_animationOut) {
                self.el.classList.add(..._animationOut);
            }
        },

        self._onResize = function()
        {
            self.el.classList.add('is-hidden');

            var _animationIn = opts.animation.in,
                _animationOut = opts.animation.out,
                options = {};

            if (_animationIn) {
                self.el.classList.remove(..._animationIn);
            }

            if (_animationOut) {
                self.el.classList.remove(..._animationOut);
            }

            if (!opts.adaptive || !isMobile()) {
                self.el.classList.remove('lightpick--adaptive');

                var backdrop = document.querySelector('.lightpick__backdrop');
                if (backdrop) {
                    backdrop.parentNode.removeChild(backdrop);
                }
                return;
            }
            self.el.classList.add('lightpick--adaptive');
            self.el.removeAttribute('style');

            if (opts.adaptive && isMobile()) {
                if (window.innerWidth < 500) {
                    options.numberOfMonths = 1;
                    options.numberOfColumns = 1;

                    self.el.classList.remove('lightpick--2-columns');
                    self.el.classList.add('lightpick--1-columns');
                }
                else {
                    options.numberOfMonths = 2;
                    options.numberOfColumns = 2;

                    self.el.classList.remove('lightpick--1-columns');
                    self.el.classList.add('lightpick--2-columns');
                }
            }

            self.reloadOptions(options);
            self.hide();
        };

        self.el.addEventListener('mousedown', self._onMouseDown, true);
        self.el.addEventListener('mouseenter', self._onMouseEnter, true);
        self.el.addEventListener('touchend', self._onMouseDown, true);

        self.hide();

        opts.field.addEventListener('change', self._onInputChange);
        opts.field.addEventListener('click', self._onInputClick);
        opts.field.addEventListener('focus', self._onInputFocus);

        if (opts.secondField) {
            opts.secondField.addEventListener('change', self._onInputChange);
            opts.secondField.addEventListener('click', self._onInputClick);
            opts.secondField.addEventListener('focus', self._onInputFocus);
        }

        if (opts.adaptive || isMobile()){
            window.addEventListener('resize', self._onResize);
        }
    };

    Lightpick.prototype = {
        config: function(options)
        {
            var opts = {...defaults, ...options};

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.calendar = [moment().set('date', 1)];

            if (opts.numberOfMonths === 1 && opts.numberOfColumns > 1) {
                opts.numberOfColumns = 1;
            }

            opts.minDate = opts.minDate && moment(opts.minDate).isValid() ? moment(opts.minDate) : null;

            opts.maxDate = opts.maxDate && moment(opts.maxDate).isValid() ? moment(opts.maxDate) : null;

            if (opts.lang === 'auto') {
                var browserLang = navigator.language || navigator.userLanguage;
                if (browserLang) {
                    opts.lang = browserLang;
                }
                else {
                    opts.lang = 'en-US';
                }
            }

            if (opts.secondField && opts.singleDate) {
                opts.singleDate = false;
            }

            if (opts.hoveringTooltip && opts.singleDate) {
                opts.hoveringTooltip = false;
            }

            if (isObject(options.locale)) {
                opts.locale = {...defaults.locale, ...options.locale};
            }

            if (opts.adaptive && isMobile()) {
                if (window.innerWidth < 600) {
                    opts.numberOfMonths = 1;
                    opts.numberOfColumns = 1;
                }
                else {
                    opts.numberOfMonths = 2;
                    opts.numberOfColumns = 2;
                }
            }

            if (opts.repick && !opts.secondField) {
                opts.repick = false;
            }

            this._opts = {...opts};

            this.setStartDate(opts.startDate, true);
            this.setEndDate(opts.endDate, true);

            return opts;
        },

        swapDate: function()
        {
            var tmp = moment(this._opts.startDate);
            this.setDateRange(this._opts.endDate, tmp);
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        gotoDate: function(date)
        {
            var date = moment(date);

            if (!date.isValid()) {
                date = moment();
            }

            date.set('date', 1);

            this._opts.calendar = [moment(date)];

            renderCalendar(this.el, this._opts);
        },

        gotoMonth: function(month) 
        {
            if (isNaN(month)) {
                return;
            }

            this._opts.calendar[0].set('month', month);

            renderCalendar(this.el, this._opts);
        },

        prevMonth: function()
        {
            this._opts.calendar[0] = moment(this._opts.calendar[0]).subtract(this._opts.numberOfMonths, 'month');

            renderCalendar(this.el, this._opts);
        },

        nextMonth: function()
        {
            this._opts.calendar[0] = moment(this._opts.calendar[1]);

            renderCalendar(this.el, this._opts);
        },

        prevYear: function()
        {
            this._opts.calendar[0] = moment(this._opts.calendar[0]).subtract(1, 'year');

            renderMonthsOfYear(this.el, this._opts);
        },

        nextYear: function()
        {
            this._opts.calendar[0] = moment(this._opts.calendar[0]).add(1, 'year');

            renderMonthsOfYear(this.el, this._opts);
        },

        updatePosition: function(opts)
        {
            if (this.el.classList.contains('lightpick--inlined')) return;

            if (opts.adaptive && isMobile()) return;

            var rect = this._opts.field.getBoundingClientRect();

            this.el.style.top = (rect.bottom + window.pageYOffset) + 'px';
            this.el.style.left = (rect.left + window.pageXOffset) + 'px';
        },

        setStartDate: function(date, preventOnSelect)
        {
            var date = moment(date);

            if (!date.isValid()) {
                this._opts.startDate = null;
                this._opts.field.value = '';
                return;
            }

            this._opts.startDate = moment(date);

            if (this._opts.singleDate || this._opts.secondField) {
                this._opts.field.value = this._opts.startDate.format(this._opts.format);
            }
            else {
                this._opts.field.value = this._opts.startDate.format(this._opts.format) + this._opts.separator + '...'
            }

            if (!preventOnSelect && typeof this._opts.onSelect === 'function') {
                this._opts.onSelect.call(this, this.getStartDate(), this.getEndDate());
            }
        },

        setEndDate: function(date, preventOnSelect)
        {
            var date = moment(date);

            if (!date.isValid()) {
                this._opts.endDate = null;

                if (this._opts.secondField) {
                    this._opts.secondField.value = '';
                }
                else if (!this._opts.singleDate && this._opts.startDate) {
                    this._opts.field.value = this._opts.startDate.format(this._opts.format) + this._opts.separator + '...'
                }
                return;
            }

            this._opts.endDate = moment(date);

            if (this._opts.secondField) {
                this._opts.field.value = this._opts.startDate.format(this._opts.format);
                this._opts.secondField.value = this._opts.endDate.format(this._opts.format);
            }
            else {
                this._opts.field.value = this._opts.startDate.format(this._opts.format) + this._opts.separator + this._opts.endDate.format(this._opts.format);
            }

            if (!preventOnSelect && typeof this._opts.onSelect === 'function') {
                this._opts.onSelect.call(this, this.getStartDate(), this.getEndDate());
            }
        },

        setDate: function(date)
        {
            if (!this._opts.singleDate) {
                return;
            }
            this.setStartDate(date, true);
        },

        setDateRange: function(start, end, preventOnSelect)
        {
            if (this._opts.singleDate) {
                return;
            }
            this.setStartDate(start, true);
            this.setEndDate(end, true);

            if (this.isShowing) {
                updateDates(this.el, this._opts);
            }

            if (!preventOnSelect && typeof this._opts.onSelect === 'function') {
                this._opts.onSelect.call(this, this.getStartDate(), this.getEndDate());
            }
        },

        setDisableDates: function(dates)
        {
            this._opts.disableDates = dates;

            if (this.isShowing) {
                updateDates(this.el, this._opts);
            }
        },

        getStartDate: function()
        {
            return moment(this._opts.startDate).isValid() ? this._opts.startDate : null;
        },

        getEndDate: function()
        {
            return moment(this._opts.endDate).isValid() ? this._opts.endDate : null;
        },

        getDate: function()
        {
            return moment(this._opts.startDate).isValid() ? this._opts.startDate : null;
        },

        toString: function(format)
        {
            if (this._opts.singleDate) {
                return moment(this._opts.startDate).isValid() ? this._opts.startDate.format(format) : '';
            }

            if (moment(this._opts.startDate).isValid() && moment(this._opts.endDate).isValid()) {
                return this._opts.startDate.format(format) + this._opts.separator + this._opts.endDate.format(format);
            }

            if (moment(this._opts.startDate).isValid() && !moment(this._opts.endDate).isValid()) {
                return this._opts.startDate.format(format) + this._opts.separator + '...';
            }

            if (!moment(this._opts.startDate).isValid() && moment(this._opts.endDate).isValid()) {
                return '...' + this._opts.separator + this._opts.endDate.format(format);
            }

            return '';
        },

        show: function(target)
        {
            if (!this.isShowing) {
                this.isShowing = true;

                if (this._opts.repick) {
                    this._opts.repickTrigger = target;
                }

                if (this._opts.secondField && this._opts.secondField === target && this._opts.endDate) {
                    this.gotoDate(this._opts.endDate);
                }
                else {
                    this.gotoDate(this._opts.startDate);
                }

                document.addEventListener('click', this._onClick);

                this.updatePosition(this._opts);

                this.el.classList.remove('is-hidden');

                this.animationIn();

                if (typeof this._opts.onOpen === 'function') {
                    this._opts.onOpen.call(this);
                }

                this.el.querySelector('.lightpick__months-of-the-year').innerHTML = '';

                if (document.activeElement && document.activeElement != document.body) {
                    document.activeElement.blur();
                }

                if (this._opts.adaptive && isMobile()) {
                    var backdrop = document.createElement('div');
                    backdrop.className = 'lightpick__backdrop';
                    document.body.appendChild(backdrop);
                }
            }
        },

        hide: function()
        {
            if (this.isShowing) {
                this.isShowing = false;

                document.removeEventListener('click', this._onClick);

                this.animationOut();

                this.el.querySelector('.lightpick__tooltip').style.visibility = 'hidden';

                if (typeof this._opts.onClose === 'function') {
                    this._opts.onClose.call(this);
                }

                if (this._opts.adaptive && isMobile()) {
                    var backdrop = document.querySelector('.lightpick__backdrop');
                    if (backdrop) {
                        backdrop.parentNode.removeChild(backdrop);
                    }
                }
            }
        },

        destroy: function()
        {
            var opts = this._opts;

            this.hide();
            this.el.removeEventListener('mousedown', this._onMouseDown, true);
            this.el.removeEventListener('touchend', this._onMouseDown, true);
            this.el.removeEventListener('change', this._onChange, true);

            opts.field.removeEventListener('change', this._onInputChange);
            opts.field.removeEventListener('click', this._onInputClick);
            opts.field.removeEventListener('focus', this._onInputFocus);

            if (opts.secondField) {
                opts.secondField.removeEventListener('change', this._onInputChange);
                opts.secondField.removeEventListener('click', this._onInputClick);
                opts.secondField.removeEventListener('focus', this._onInputFocus);
            }

            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }

            if (opts.adaptive || isMobile()){
                window.removeEventListener('resize', this._onResize);
            }
        },

        reloadOptions: function(options)
        {
            this._opts = {...this._opts, ...options};
        }

    };

    return Lightpick;
}));
