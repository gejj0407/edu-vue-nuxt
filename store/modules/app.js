/**
 * @module main/store/modules/app
 * @description 应用相关的store
 */

const state = () => {
  return {
    primaryColor: '#0D7FF6',
    initPrimaryColor: '#0D7FF6',
    size: 'small',
    defualtArea: {
      province: '370000',
      city: '370700',
      region: '',
    },
    areaCodes: ['370000', '370700', '370703'],
    areaName: ['山东省', '潍坊市', '寒亭区'],
  }
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  // 设置主题色
  SET_PRIMARY_COLOR(state, color) {
    utils.setCookie('primaryColor', color)
    state.primaryColor = color
  },
  SET_SIZE(state, size) {
    utils.setCookie('size', color)
    state.size = size
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
