export default (form) => ({
  form,
  loading: false,

  submit() {
    this.loading = true
    setTimeout(() => {
      form.submit()
    }, 250)
  },
})
