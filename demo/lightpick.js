import Lightpick from '../assets/js/lightpick'
import Moment from 'moment'
import '../assets/scss/index.scss';

const datepickers = document.querySelectorAll('.c-datepicker')
datepickers &&
datepickers.forEach(datepicker => {
    new Lightpick({
        field: datepicker,
        format: datepicker.dataset.format,
        lang: datepicker.dataset.lang,
        singleDate: datepicker.dataset.single_date === 'true',
        footer: true,
        buttons: {
            prev: '←',
            next: '→',
            close: '×',
            reset: 'Reset',
            apply: 'Apply'
        },
        tooltip: {
            one: 'day',
            other: 'days'
        },
        onOpen: () => {
            datepicker.classList.add('c-datepicker--open')
        },
        onClose: () => {
            datepicker.classList.remove('c-datepicker--open')
        }
    })
})
