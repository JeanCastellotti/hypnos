export default () => ({
  opened: false,
  id: null,
  open(id) {
    this.id = id
    this.opened = true
  },
  close() {
    this.opened = false
  },
})
