import Vue from 'vue'

export default Vue.directive('focus', {
  inserted (el, binding) {
    el.querySelector('input').focus()
  },
  update (el, binding) {
    if (binding.value) {
      el.querySelector('input').focus()
    }
  }
})