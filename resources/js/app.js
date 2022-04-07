import '../css/app.css'

import Alpine from 'alpinejs'
import bookingForm from './components/bookingForm'
import form from './components/form'

Alpine.data('bookingForm', bookingForm)
Alpine.data('form', form)

Alpine.start()
