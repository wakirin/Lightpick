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
        root.Kingpicker = factory(root.moment);
    }
}(this, function(moment, $) {
    'use strict';

    var document = window.document,

    defaults = {

        field: null,

        firstDay: 1,

        parentEl: 'body',

        lang: 'en',

        prevHtml: '&lt;',

        nextHtml: '&gt;',

        format: 'YYYY-MM-DD',

        separator: ' - ',

        numberOfMonths: 1,

        numberOfColumns: 2,

        singleDate: true,

        autoclose: true,

        startDate: null,

        endDate: null,

        onSelect: null,

    },

    Kingpicker = function(options)
    {
        var self = this,
            opts = self.config(options);

        self.el = document.createElement('div');

        self.el.className = 'kingpicker-container rows-' + opts.numberOfColumns;
        document.querySelector(opts.parentEl).appendChild(self.el);

        self._onMouseDown = function(e)
        {
            console.log('_onMouseDown');
            if (!self.isShowing) {
                return;
            }

            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (target.classList.contains('day') && target.classList.contains('available')) {

                if (self._opts.singleDate || (!self._opts.startDate && !self._opts.endDate) || (self._opts.startDate && self._opts.endDate)) {

                    self.setStartDate(moment(parseInt(target.getAttribute('data-time'))));
                    self.setEndDate(null);

                    document.querySelectorAll('.day').forEach(function(day){
                        day.classList.remove('start-date', 'in-range', 'end-date');
                    });

                    target.classList.add('start-date');

                    if (self._opts.singleDate && self._opts.autoclose) {
                        setTimeout(function() {
                            self.hide();
                        }, 100);
                    }
                }
                else if (self._opts.startDate && !self._opts.endDate) {

                    var endDate = moment(parseInt(target.getAttribute('data-time')));

                    if (self._opts.startDate.isAfter(endDate)) {
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

                    if (dt.isValid() && dt.isSameOrAfter(self._opts.startDate) && dt.isSameOrBefore(hoverDate)) {
                        day.classList.add('in-range');
                    }
                    else if (dt.isValid() && dt.isSameOrAfter(hoverDate) && dt.isSameOrBefore(self._opts.startDate)) {
                        day.classList.add('in-range', 'invert');
                    }
                    else {
                        day.classList.remove('in-range');
                    }

                    day.classList.remove('end-date');
                });

                target.classList.add('end-date');
            }

            console.log(target);
        };
        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (target.classList.contains('kingpicker-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (target.classList.contains('kingpicker-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onInputChange = function(e)
        {
            console.log('_onInputChange');

            if (self._opts.singleDate) {
                if (!self._opts.autoclose) {
                    self.gotoMonth(opts.field.value);
                }

                self.setStartDate(opts.field.value);
            }

            if (!self.isShowing) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            self.show();
        };

        self._onClick = function(e)
        {
            console.log('_onClick');
            e = e || window.event;
            var target = e.target || e.srcElement,
                parentEl = target;

            if (!target) {
                return;
            }

            do {
                if ((parentEl.classList && parentEl.classList.contains('kingpicker-container')) || parentEl === opts.field) {
                    return;
                }
            }
            while ((parentEl = parentEl.parentNode));

            console.log(target, parentEl);

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
    };

    Kingpicker.prototype = {
        config: function(options)
        {
            var opts = Object.assign({}, defaults, options);

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.calendar = [moment().set('date', 1)];

            if (opts.numberOfMonths === 1 && opts.numberOfColumns > 1) {
                opts.numberOfColumns = 1;
            }
                
            this._opts = Object.assign({}, opts);

            return opts;
        },

        gotoMonth: function(date) {
            var date = moment(date);

            if (!date.isValid()) {
                date = moment();
            }

            date.set('date', 1);

            this._opts.calendar = [moment(date)];

            this.renderCalendar();
        },

        setStartDate: function(date, preventOnSelect){
            var date = moment(date);

            if (!date.isValid()) {
                this._opts.startDate = null;
                return;
            }

            this._opts.startDate = moment(date);

            if (this._opts.singleDate) {
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
                return;
            }

            this._opts.endDate = moment(date);

            this._opts.field.value = this._opts.startDate.format(this._opts.format) + this._opts.separator + this._opts.endDate.format(this._opts.format);

            if (!preventOnSelect && typeof this._opts.onSelect === 'function') {
                this._opts.onSelect.call(this, this.getStartDate(), this.getEndDate());
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

        prevMonth: function(){
            this._opts.calendar[0] = moment(this._opts.calendar[0]).subtract(this._opts.numberOfMonths, 'month');

            this.renderCalendar();
        },

        nextMonth: function(){
            this._opts.calendar[0] = moment(this._opts.calendar[1]);

            this.renderCalendar();
        },

        weekdayName: function(day, short){
            return new Date(1970, 0, day).toLocaleString(this._opts.lang, { weekday: short ? 'short' : 'long' })
        },

        renderDay: function(date, dummy, extraClass){
            if (dummy) return '<div></div>';

            var prevMonth = moment(date).subtract(1, 'month'),
                nextMonth = moment(date).add(1, 'month');

            var day = {
                time: date.valueOf(),
                className: ['day', 'available', extraClass]
            };

            if (date.isSame(new Date(), 'day')) {
                day.className.push('today');
            }

            if (date.isSame(this._opts.startDate, 'day')) {
                day.className.push('start-date');
            }

            if (date.isSame(this._opts.endDate, 'day')) {
                day.className.push('end-date');
            }

            if (moment().isSame(date, 'month')) {
                
            }
            else if (prevMonth.isSame(date, 'month')) {
                day.className.push('prev-month');
            }
            else if (nextMonth.isSame(date, 'month')) {
                day.className.push('next-month');
            }

            var div = document.createElement('div');
            div.className = day.className.join(' ');
            div.innerHTML = date.get('date');
            div.setAttribute('data-time', day.time);

            return div.outerHTML;
        },

        renderTopButtons: function(){
            return '<div class="top-buttons">' 
                 + '<button type="button" class="prev">' + this._opts.prevHtml + '</button>'
                 + '<button type="button" class="next">' + this._opts.nextHtml + '</button>' 
                 + '</div>';
        },

        renderCalendar: function() {
            console.log('renderCalendar', this._opts.startDate);
            var html = '',
                opts = this._opts,
                monthDate = moment(opts.calendar[0]);

            if (opts.numberOfMonths > 1) {
                html += this.renderTopButtons();
            }

            html += '<div class="months">';

            for (var i = 0; i < opts.numberOfMonths; i++) {
                var day = moment(monthDate);

                html += '<div class="month">';
                html += '<div class="title">'
                html += '<div>' + day.toDate().toLocaleString(opts.lang, { month: 'long' }) + ' ' + day.format('YYYY')  + '</div>';

                if (opts.numberOfMonths === 1) {
                    html += this.renderTopButtons();
                }

                html += '</div>';

                html += '<div class="daynames">';
                for (var w = opts.firstDay + 4; w < 7 + opts.firstDay + 4; ++w) {
                    html += '<div title="' + this.weekdayName(w) + '">' + this.weekdayName(w, true) + '</div>';
                }
                html += '</div>';

                html += '<div class="days">';

                if (day.isoWeekday() !== opts.firstDay) {
                    var prevDays = day.isoWeekday() - opts.firstDay > 0 ? day.isoWeekday() - opts.firstDay : day.isoWeekday(),
                        prevMonth = moment(day).subtract(prevDays, 'day'),
                        daysInMonth = prevMonth.daysInMonth();

                    for (var d = prevMonth.get('date'); d <= daysInMonth; d++) {

                        html += this.renderDay(prevMonth, i > 0, 'prev-month');

                        prevMonth.add(1, 'day');

                    }
                }

                var daysInMonth = day.daysInMonth(),
                    today = new Date();

                for (var d = 0; d < daysInMonth; d++) {

                    html += this.renderDay(day);

                    day.add(1, 'day');

                }

                var nextMonth = moment(day),
                    nextDays = 7 - nextMonth.isoWeekday() + opts.firstDay;

                for (var d = nextMonth.get('date'); d <= nextDays; d++) {

                    html += this.renderDay(nextMonth, i < opts.numberOfMonths - 1, 'next-month');

                    nextMonth.add(1, 'day');

                }



                html += '</div>'; // days

                html += '</div>'; // month

                monthDate.add(1, 'month');
            }

            html += '</div>'; // months

            this._opts.calendar[1] = moment(monthDate);

            this.el.innerHTML = html;
        },

        updatePosition: function(){
            var rect = this._opts.field.getBoundingClientRect();

            this.el.style.top = (rect.bottom + window.pageYOffset) + 'px';
            this.el.style.left = (rect.left + window.pageXOffset) + 'px';
        },

        show: function(){
            if (!this.isShowing) {
                this.isShowing = true;

                this.gotoMonth(this._opts.startDate);              

                document.addEventListener('click', this._onClick, true);

                this.updatePosition();

                this.el.classList.remove('is-hidden');
            }
        }, 

        hide: function(){
            if (this.isShowing) {
                this.isShowing = false;

                document.removeEventListener('click', this._onClick);

                this.el.classList.add('is-hidden');
            }
        },
    };

    return Kingpicker;
}));