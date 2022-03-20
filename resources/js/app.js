import Alpine from 'alpinejs'
import '../css/app.css'

Alpine.data('modal', () => ({
  isOpen: false,
  message: null,
  id: null,
  open(elt) {
    this.isOpen = true
    this.message = elt.dataset.message
    this.id = elt.dataset.id
  },
  close() {
    this.isOpen = false
  },
}))

Alpine.start()
