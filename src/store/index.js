import Vue from 'vue'
import Vuex from 'vuex'
import routes from './module/routes'
import user from './module/user'
import app from './module/app'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    routes,
    app
  },
  getters
})
