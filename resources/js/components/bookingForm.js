export default () => ({
  updateQuery() {
    console.log(this.$el)
    const url = new URL(window.location)
    url.searchParams.set(this.$el.name, this.$el.value)
    if (this.$el.name === 'establishment') url.searchParams.delete('suite')
    window.history.pushState({}, '', url)
  },
})
