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

    callEvent = function(el, eventName, data) {
        var ev;

        ev = document.createEvent('HTMLEvents');
        ev.initEvent(eventName, true, false);
        ev = extend(ev, data);
        el.dispatchEvent(ev);
    },

    defaults = {
        field: null,
        firstDay: 1,
        parentEl: 'body',
        lang: 'en',
        prevHtml: '&lt;',
        nextHtml: '&gt;',
        numberOfMonths: 1,
        monthsInRow: 2,
        startDate: null
    },

    Kingpicker = function(options)
    {
        var self = this,
            opts = self.config(options);

        self.el = document.createElement('div');

        self.el.className = 'kingpicker-container rows-' + opts.monthsInRow;
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

            if (target.classList.contains('prev')) {
                self.prevMonth();
            }
            else if (target.classList.contains('next')) {
                self.nextMonth();
            }

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
            var date;

            if (e.firedBy === self) {
                return;
            }

            self.setStartDate(opts.field.value);

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
            console.log('click');
            e = e || window.event;
            var target = e.target || e.srcElement,
                parentEl = target;

            if (!target) {
                return;
            }

            do {
                if (parentEl.classList.contains('kingpicker-single') || parentEl === opts.field) {
                    return;
                }
            }
            while ((parentEl = parentEl.parentNode));

            if (self.isShowing && target !== opts.field && parentEl !== opts.field) {
                self.hide();
            }
        };

        self.el.addEventListener('mousedown', self._onMouseDown, true);
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

            opts.startDate = moment(opts.startDate);

            if (!opts.startDate.isValid()) {
                opts.startDate = moment();
                opts.startDate.set('date', 1);
            }

            if (opts.numberOfMonths === 1 && opts.monthsInRow > 1) {
                opts.monthsInRow = 1;
            }
                
            this._opts = Object.assign({}, opts);

            return opts;
        },

        setStartDate: function(startDate) {
            var date = moment(startDate);

            if (!date.isValid()) {
                date = moment();
            }

            date.set('date', 1);

            this._opts.startDate = moment(date);

            this.renderCalendar();
        },

        prevMonth: function(){
            this._opts.startDate = moment(this._opts.startDate).subtract(this._opts.numberOfMonths, 'month');

            this.renderCalendar();
        },

        nextMonth: function(){
            this._opts.startDate = moment(this._opts.endDate);

            this.renderCalendar();
        },

        renderCalendar: function() {
            console.log('renderCalendar');
            var html = '',
                opts = this._opts,
                monthDate = moment(opts.startDate);

            if (opts.numberOfMonths > 1) {
                html += '<div class="top-buttons">' 
                     + '<button type="button" class="prev">' + opts.prevHtml + '</button>'
                     + '<button type="button" class="next">' + opts.nextHtml + '</button>' 
                     + '</div>';
            }

            html += '<div class="months">';

            for (var i = 0; i < opts.numberOfMonths; i++) {
                var day = moment(monthDate);

                html += '<div class="month">';
                html += '<div class="title">'
                html += '<div>' + day.toDate().toLocaleString(opts.lang, { month: 'long' }) + ' ' + day.format('YYYY')  + '</div>';

                if (opts.numberOfMonths === 1) {
                    html += '<div>' 
                         + '<button type="button" class="prev">' + opts.prevHtml + '</button>'
                         + '<button type="button" class="next">' + opts.nextHtml + '</button>' 
                         + '</div>';
                }

                html += '</div>';

                html += '<div class="daynames">';
                for (var w = opts.firstDay + 4; w < 7 + opts.firstDay + 4; ++w) {
                    html += '<div>' + new Date(1970, 0, w).toLocaleString(opts.lang, { weekday: 'short' }) + '</div>';
                }
                html += '</div>';

                html += '<div class="days">';

                if (day.isoWeekday() !== opts.firstDay) {
                    var prevDays = day.isoWeekday() - opts.firstDay > 0 ? day.isoWeekday() - opts.firstDay : day.isoWeekday(),
                        prevMonth = moment(day).subtract(prevDays, 'day'),
                        daysInMonth = prevMonth.daysInMonth();

                    for (var d = prevMonth.get('date'); d <= daysInMonth; d++) {
                        var dayClass = ['day', 'prev-month'];

                        if (i === 0) {
                            html += '<div class="' + dayClass.join(' ') + '">' + prevMonth.get('date') + '</div>';
                        }
                        else {
                            html += '<div></div>';
                        }

                        prevMonth.add(1, 'day');
                    }
                }

                var daysInMonth = day.daysInMonth(),
                    today = new Date();

                for (var d = 0; d < daysInMonth; d++) {
                    var dayClass = ['day'];

                    if (day.isSame(today, 'day')) dayClass.push('today');

                    html += '<div class="' + dayClass.join(' ') + '">' + day.get('date') + '</div>';

                    day.add(1, 'day');
                }

                var nextMonth = moment(day),
                    nextDays = 7 - nextMonth.isoWeekday() + opts.firstDay;

                for (var d = nextMonth.get('date'); d <= nextDays; d++) {
                    var dayClass = ['day', 'next-month'];

                    if (i === opts.numberOfMonths - 1) {
                        html += '<div class="' + dayClass.join(' ') + '">' + nextMonth.get('date') + '</div>';
                    }
                    else {
                        html += '<div></div>';
                    }

                    nextMonth.add(1, 'day');
                }



                html += '</div>'; // days

                html += '</div>'; // month

                monthDate.add(1, 'month');
            }

            html += '</div>'; // months

            this._opts.endDate = moment(monthDate);

            this.el.innerHTML = html;
        },

        hide: function(){
            if (this.isShowing) {
                this.isShowing = false;

                document.removeEventListener('click', self._onClick);

                this.el.classList.add('is-hidden');
            }
        },

        show: function(){
            if (!this.isShowing) {
                this.isShowing = true;

                this.renderCalendar();

                document.addEventListener('click', self._onClick);

                this.el.classList.remove('is-hidden');
            }
        }
    };

    return Kingpicker;
}));