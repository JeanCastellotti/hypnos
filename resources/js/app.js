import '../css/app.css'

import Alpine from 'alpinejs'
import modal from './components/modal'
import snackbar from './components/snackbar'
import bookingForm from './components/bookingForm'

Alpine.data('modal', modal)
Alpine.data('snackbar', snackbar)
Alpine.data('bookingForm', bookingForm)

Alpine.start()
