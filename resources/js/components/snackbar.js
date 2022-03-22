export default (elt) => ({
  snackbar: elt,
  init(time = 5000) {
    this.timeout = setTimeout(() => {
      this.snackbar.remove()
    }, time)
  },
  close() {
    clearTimeout(this.timeout)
    this.snackbar.remove()
  },
})
