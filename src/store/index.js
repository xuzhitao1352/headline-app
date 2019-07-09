import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user'))
  },
  mutations: {
    setUser (state, user) {
      window.localStorage.setItem('user', JSON.stringify(user))
    }
  },
  actions: {

  }
})
