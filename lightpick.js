/**
* @version: 0.0.1
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
        root.lightPick = factory(root.moment);
    }
}(this, function(moment, $) {
    'use strict';

    var document = window.document,

    defaults = {
        field: null,
        secondField: null,
        firstDay: 1,
        parentEl: 'body',
        lang: 'auto',
        buttons: {
            prev: '&lt;',
            next: '&gt;',
            close: '&times;',
        },
        format: 'DD/MM/YYYY',
        separator: ' - ',
        numberOfMonths: 1,
        numberOfColumns: 2,
        singleDate: true,
        autoclose: true,
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
    },

    renderTopButtons = function(opts){
        return '<div class="top-buttons">' 
            + ''
            + '<button type="button" class="prev">' + opts.buttons.prev + '</button>'
            + '<button type="button" class="next">' + opts.buttons.next + '</button>' 
            + (!opts.autoclose ? '<button type="button" class="close">' + opts.buttons.close + '</button>'  : '')
            + '</div>';
    },

    weekdayName = function(opts, day, short){
        return new Date(1970, 0, day).toLocaleString(opts.lang, { weekday: short ? 'short' : 'long' })
    },

    renderDay = function(opts, date, dummy, extraClass){
        if (dummy) return '<div></div>';

        var date = moment(date),
            prevMonth = moment(date).subtract(1, 'month'),
            nextMonth = moment(date).add(1, 'month');

        var day = {
            time: moment(date).valueOf(),
            className: ['day', 'available']
        };

        if (extraClass instanceof Array || Object.prototype.toString.call(extraClass) === '[object Array]') {
            extraClass = extraClass.filter( function( el ) {
                return ['start-date', 'in-range', 'end-date'].indexOf( el ) < 0;
            });
            day.className = day.className.concat(extraClass);
        }
        else {
            day.className.push(extraClass);
        }

        if (opts.minDays && opts.startDate && !opts.endDate) {
            if (
                date.isBetween(moment(opts.startDate).subtract(opts.minDays - 1, 'day'), moment(opts.startDate).add(opts.minDays - 1, 'day'), 'day')
                && !date.isSame(opts.startDate, 'day')
            ) {
                day.className.push('disabled');
            }
        }

        if (opts.maxDays && opts.startDate && !opts.endDate) {
            if (date.isSameOrBefore(moment(opts.startDate).subtract(opts.maxDays, 'day'), 'day')) {
                day.className.push('disabled');
            }
            else if (date.isSameOrAfter(moment(opts.startDate).add(opts.maxDays, 'day'), 'day')) {
                day.className.push('disabled');
            }
        }

        if (date.isSame(new Date(), 'day')) {
            day.className.push('today');
        }

        if (date.isSame(opts.startDate, 'day')) {
            day.className.push('start-date');
        }

        if (date.isSame(opts.endDate, 'day')) {
            day.className.push('end-date');
        }

        if (opts.startDate && opts.endDate && date.isBetween(opts.startDate, opts.endDate, 'day', '[]')) {
            day.className.push('in-range');
        }

        if (moment().isSame(date, 'month')) {
            
        }
        else if (prevMonth.isSame(date, 'month')) {
            day.className.push('prev-month');
        }
        else if (nextMonth.isSame(date, 'month')) {
            day.className.push('next-month');
        }

        if (opts.minDate && date.isBefore(opts.minDate, 'day')) {
            day.className.push('disabled');
        }

        if (opts.maxDate && date.isAfter(opts.maxDate, 'day')) {
            day.className.push('disabled');
        }

        if (opts.selectForward && !opts.singleDate && opts.startDate && !opts.endDate && date.isBefore(opts.startDate, 'day')) {
            day.className.push('disabled');
        }

        if (opts.selectBackward && !opts.singleDate && opts.startDate && !opts.endDate && date.isAfter(opts.startDate, 'day')) {
            day.className.push('disabled');
        }

        if (opts.disableDates) {
            for (var i = 0; i < opts.disableDates.length; i++) {
                if (opts.disableDates[i] instanceof Array || Object.prototype.toString.call(opts.disableDates[i]) === '[object Array]') {
                    if (moment(opts.disableDates[i][0]).isValid() 
                        && moment(opts.disableDates[i][1]).isValid() 
                        && date.isBetween(moment(opts.disableDates[i][0]), moment(opts.disableDates[i][1]), 'day', '[]')){

                        day.className.push('disabled');

                    }
                }
                else if (moment(opts.disableDates[i]).isValid() && moment(opts.disableDates[i]).isSame(date, 'day')) {
                    day.className.push('disabled');
                }

                if (day.className.indexOf('disabled') >= 0) {
                    if (day.className.indexOf('start-date') >= 0) {
                        this.setStartDate(null);
                        this.setEndDate(null);
                    }
                    else if (day.className.indexOf('end-date') >= 0) {
                        this.setEndDate(null);
                    }
                }
            }
        }

        day.className = day.className.filter(function(value, index, self) { 
            return self.indexOf(value) === index;
        });

        if (day.className.indexOf('disabled') >= 0 && day.className.indexOf('available') >= 0) {
            day.className.splice(day.className.indexOf('available'), 1);
        }

        var div = document.createElement('div');
        div.className = day.className.join(' ');
        div.innerHTML = date.get('date');
        div.setAttribute('data-time', day.time);

        return div.outerHTML;
    },

    renderCalendar = function(el, opts) {
        var html = '',
            monthDate = moment(opts.calendar[0]);

        if (opts.numberOfMonths > 1) {
            html += renderTopButtons(opts);
        }

        html += '<div class="months">';

        for (var i = 0; i < opts.numberOfMonths; i++) {
            var day = moment(monthDate);

            html += '<div class="month">';
            html += '<div class="title">'
            html += '<div>' + day.toDate().toLocaleString(opts.lang, { month: 'long' }) + ' ' + day.format('YYYY')  + '</div>';

            if (opts.numberOfMonths === 1) {
                html += renderTopButtons(opts);
            }

            html += '</div>';

            html += '<div class="daynames">';
            for (var w = opts.firstDay + 4; w < 7 + opts.firstDay + 4; ++w) {
                html += '<div title="' + weekdayName(opts, w) + '">' + weekdayName(opts, w, true) + '</div>';
            }
            html += '</div>';

            html += '<div class="days">';

            if (day.isoWeekday() !== opts.firstDay) {
                var prevDays = day.isoWeekday() - opts.firstDay > 0 ? day.isoWeekday() - opts.firstDay : day.isoWeekday(),
                    prevMonth = moment(day).subtract(prevDays, 'day'),
                    daysInMonth = prevMonth.daysInMonth();

                for (var d = prevMonth.get('date'); d <= daysInMonth; d++) {
                    html += renderDay(opts, prevMonth, i > 0, 'prev-month');

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
                html += renderDay(opts, nextMonth, i < opts.numberOfMonths - 1, 'next-month');

                nextMonth.add(1, 'day');
            }

            html += '</div>'; // days

            html += '</div>'; // month

            monthDate.add(1, 'month');
        }

        html += '</div>'; // months

        opts.calendar[1] = moment(monthDate);

        el.innerHTML = html;
    },

    updateDates = function(el, opts){
        el.querySelectorAll('.day').forEach(function(day) {
            day.outerHTML = renderDay(opts, parseInt(day.getAttribute('data-time')), false, day.className.split(' '));
        });
    },

    lightPick = function(options)
    {
        var self = this,
            opts = self.config(options);

        self.el = document.createElement('div');

        self.el.className = 'lightpick-container rows-' + opts.numberOfColumns;
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

            if (target.classList.contains('day') && target.classList.contains('available')) {

                if (self._opts.singleDate || (!self._opts.startDate && !self._opts.endDate) || (self._opts.startDate && self._opts.endDate)) {

                    self.setStartDate(moment(parseInt(target.getAttribute('data-time'))));
                    self.setEndDate(null);

                    target.classList.add('start-date');

                    if (self._opts.singleDate && self._opts.autoclose) {
                        setTimeout(function() {
                            self.hide();
                        }, 100);
                    }
                    else if (!self._opts.singleDate) {
                        updateDates(self.el, self._opts);
                    }
                }
                else if (self._opts.startDate && !self._opts.endDate) {

                    var endDate = moment(parseInt(target.getAttribute('data-time')));

                    if (self._opts.startDate.isAfter(endDate, 'day')) {
                        var tmp = moment(self._opts.startDate);
                        self._opts.startDate = moment(endDate);
                        endDate = moment(tmp);
                    }

                    self.setEndDate(endDate);

                    target.classList.add('end-date');

                    if (self._opts.autoclose) {
                        setTimeout(function() {
                            self.hide();
                        }, 100);
                    }
                }
            }
            else if (target.classList.contains('prev')) {
                self.prevMonth();
            }
            else if (target.classList.contains('next')) {
                self.nextMonth();
            }
            else if (target.classList.contains('close')) {
                self.hide();
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

            if (self._opts.singleDate || (!self._opts.startDate && !self._opts.endDate)) {
                return;
            }

            if (!target.classList.contains('day') && !target.classList.contains('available')) {
                return;
            }

            if (self._opts.startDate && !self._opts.endDate) {
                var hoverDate = moment(parseInt(target.getAttribute('data-time')));

                if (!hoverDate.isValid()) {
                    return;
                }

                self.el.querySelectorAll('.day').forEach(function(day) {
                    var dt = moment(parseInt(day.getAttribute('data-time')));

                    day.classList.remove('invert');

                    if (dt.isValid() && dt.isSameOrAfter(self._opts.startDate, 'day') && dt.isSameOrBefore(hoverDate, 'day')) {
                        day.classList.add('in-range');
                    }
                    else if (dt.isValid() && dt.isSameOrAfter(hoverDate, 'day') && dt.isSameOrBefore(self._opts.startDate, 'day')) {
                        day.classList.add('in-range', 'invert');
                    }
                    else {
                        day.classList.remove('in-range');
                    }

                    day.classList.remove('end-date');
                });

                target.classList.add('end-date');
            }
        };
        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (target.classList.contains('lightpick-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (target.classList.contains('lightpick-select-year')) {
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
                if ((parentEl.classList && parentEl.classList.contains('lightpick-container')) || parentEl === opts.field || (opts.secondField && parentEl === opts.secondField)) {
                    return;
                }
            }
            while ((parentEl = parentEl.parentNode));

            if (self.isShowing && target !== opts.field && parentEl !== opts.field) {
                self.hide();
            }
        };

        self.el.addEventListener('mousedown', self._onMouseDown, true);
        self.el.addEventListener('mouseenter', self._onMouseEnter, true);
        self.el.addEventListener('touchend', self._onMouseDown, true);

        this.hide();

        opts.field.addEventListener('change', self._onInputChange);
        opts.field.addEventListener('click', self._onInputClick);
        opts.field.addEventListener('focus', self._onInputFocus);

        if (opts.secondField) {
            opts.secondField.addEventListener('change', self._onInputChange);
            opts.secondField.addEventListener('click', self._onInputClick);
            opts.secondField.addEventListener('focus', self._onInputFocus);
        }
    };

    lightPick.prototype = {
        config: function(options)
        {
            var opts = Object.assign({}, defaults, options);

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
                
            this._opts = Object.assign({}, opts);

            return opts;
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

        gotoMonth: function(month) {
            if (isNaN(month)) {
                return;
            }

            this._opts.calendar[0].set('month', month);

            renderCalendar(this.el, this._opts);
        },

        prevMonth: function(){
            this._opts.calendar[0] = moment(this._opts.calendar[0]).subtract(this._opts.numberOfMonths, 'month');

            renderCalendar(this.el, this._opts);
        },

        nextMonth: function(){
            this._opts.calendar[0] = moment(this._opts.calendar[1]);

            renderCalendar(this.el, this._opts);
        },

        updatePosition: function(){
            var rect = this._opts.field.getBoundingClientRect();

            this.el.style.top = (rect.bottom + window.pageYOffset) + 'px';
            this.el.style.left = (rect.left + window.pageXOffset) + 'px';
        },

        setStartDate: function(date, preventOnSelect){
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

        setEndDate: function(date, preventOnSelect){
            var date = moment(date);

            if (!date.isValid()) {
                this._opts.endDate = null;

                if (this._opts.secondField) {
                    this._opts.secondField.value = '';
                }
                else if (!this._opts.singleDate) {
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

        setDate: function(date){
            if (!this._opts.singleDate) {
                return;
            }
            this.setStartDate(date, true);
        },

        setDateRange: function(start, end){
            if (this._opts.singleDate) {
                return;
            }
            this.setStartDate(start, true);
            this.setEndDate(end, true);
        },

        setDisableDates: function(dates){
            this._opts.disableDates = dates;

            if (this.isShowing) {
                updateDates(this.el, this._opts);
            }
        },

        getStartDate: function()
        {
            return moment().isValid(this._opts.startDate) ? this._opts.startDate : null;
        },

        getEndDate: function()
        {
            return moment().isValid(this._opts.endDate) ? this._opts.endDate : null;
        },

        getDate: function()
        {
            return moment().isValid(this._opts.startDate) ? this._opts.startDate : null;
        },

        show: function(target){
            if (!this.isShowing) {
                this.isShowing = true;

                if (this._opts.secondField && this._opts.secondField === target && this._opts.endDate) {
                    this.gotoDate(this._opts.endDate); 
                }
                else {
                    this.gotoDate(this._opts.startDate); 
                }

                document.addEventListener('click', this._onClick);

                this.updatePosition();

                this.el.classList.remove('is-hidden');

                if (typeof this._opts.onOpen === 'function') {
                    this._opts.onOpen.call(this);
                }
            }
        }, 

        hide: function(){
            if (this.isShowing) {
                this.isShowing = false;

                document.removeEventListener('click', this._onClick);

                this.el.classList.add('is-hidden');


                if (typeof this._opts.onClose === 'function') {
                    this._opts.onClose.call(this);
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

            opts.field.removeEventListener('change', self._onInputChange);
            opts.field.removeEventListener('click', self._onInputClick);
            opts.field.removeEventListener('focus', self._onInputFocus);

            if (opts.secondField) {
                opts.secondField.removeEventListener('change', self._onInputChange);
                opts.secondField.removeEventListener('click', self._onInputClick);
                opts.secondField.removeEventListener('focus', self._onInputFocus);
            }

            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }
    };

    return lightPick;
}));