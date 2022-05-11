/**
 * @module main/store/modules/permission
 * @description 权限相关的store
 */
// import { utils } from '@/plugins/utils'
// import menus from '@/menus'

// const cloneDeep = require('lodash/cloneDeep')

const state = () => {
  return {
    // 后台返回的菜单包括按钮
    routes: [],
    tenantModules: [], // ['',''] code组成的数组
  }
}

const getters = {
  // 渲染左侧菜单实际需要的结构，不需要按钮
  menus(state) {
    // const menus = cloneDeep(state.routes)
    // utils.filterMenu(menus)
    // return menus
  },
  // 叶子菜单的一维数组，并且带上菜单的完整路径
  leafMenus(state) {
    // return utils.filterMenu2LeafArray(state.routes)
  },
  // 按钮权限一维数组
  menuPermissions(state) {
    // return utils.filterMenuPermissions(state.routes)
  },
}

const actions = {}

const mutations = {
  SET_ROUTES(state, menus) {
    state.routes = menus
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
