/**
 * @module main/store/modules/account
 * @description 用户相关的store
 */
const state = () => {
  return {
    access_token: '',
    refresh_token: '',
    userInfo: null,
  }
}

// getters
const getters = {
  nickname(state) {
    return state.userInfo ? state.userInfo.nickname : ''
  },
  tel(state) {
    return state.userInfo ? state.userInfo.tel : ''
  },
  avatar(state) {
    return state.userInfo ? state.userInfo.image : ''
  },
  loginName(state) {
    return state.userInfo ? state.userInfo.loginName : ''
  },
  isMember(state) {
    return state.userInfo && state.userInfo.type === 'member'
  },
  isEnterprise(state) {
    return state.userInfo && state.userInfo.type === 'enterprise'
  },
}

// actions
const actions = {
  clearLoginInfo({ commit }, res) {
    commit('SET_TOKEN', '')
    commit('SET_REFRESH_TOKEN', '')
    commit('SET_USERINFO', null)
    if (res) {
      utils.setCookies(['access-token', 'refresh-token'], ['', ''], res)
    } else {
      utils.setCookies(['access-token', 'refresh-token'], ['', ''])
    }
  },
  async getUserInfo({ commit }) {
    const { code, data } = await this.$services.auth.getUserInfo()
    if (code === 0) {
      commit('SET_USERINFO', { ...data })
    }
    return { code, data }
  },
  async login({ commit, dispatch }, form) {
    const { code, data } = await this.$services.auth.login(form)
    if (code === 0) {
      // this.$elExtCookie.setToken(data.access_token, data.refresh_token)
      // this.$elExtHttp.getInstance().defaults.headers.common.Authorization = `Bearer ${data.access_token}`
      const { code: userCode, data: userData } = await dispatch('getUserInfo')
      return { code: userCode, data: userData }
    } else {
      return { code, data }
    }
  },
}

// mutations
const mutations = {
  SET_TOKEN(state, token) {
    state.access_token = token
  },
  SET_REFRESH_TOKEN(state, refreshToken) {
    state.refresh_token = refreshToken
  },
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
