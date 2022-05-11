import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/plugins/utils'
Vue.use(Vuex)

const store = () => {
  const modules = {}

  const appFiles = require.context(`./modules`, true, /\.js$/)
  appFiles.keys().forEach((v) => {
    const fileName = v.split('/')[v.split('/').length - 1]
    const key = fileName.replace(/\.\//g, '').replace(/\.js/g, '')
    modules[key] = appFiles(v).default
  })
  return new Vuex.Store({
    modules,
    actions: {
      async nuxtServerInit({commit, state, dispatch}, {req, res, store}) {
        if (utils.getCookie(req.headers.cookie, 'access-token')) {
          commit('account/SET_TOKEN', utils.getCookie(req.headers.cookie, 'access-token'))
        } else {
          commit('account/SET_TOKEN', '')
        }
        if (utils.getCookie(req.headers.cookie, 'refresh-token')) {
          commit('account/SET_REFRESH_TOKEN', utils.getCookie(req.headers.cookie, 'refresh-token'))
        } else {
          commit('account/SET_REFRESH_TOKEN', '')
        }
      },
    },
  })
}

export default store
