import '../css/app.css'

import Alpine from 'alpinejs'
import modal from './components/modal'
import snackbar from './components/snackbar'

Alpine.data('modal', modal)
Alpine.data('snackbar', snackbar)

Alpine.start()
