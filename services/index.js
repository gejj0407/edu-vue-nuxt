import Vue from 'vue'

const context = require.context('./', false, /\.js$/)
// eslint-disable-next-line
let services = null
export default (ctx, inject) => {
  services = context
    .keys()
    .filter((key) => key !== './index.js')
    .reduce(
      (result, key) => ({
        ...result,
        [key.match(/([^/]+)\.js$/)[1]]: context(key).default,
      }),
      {}
    )
  Vue.prototype.$services = services
  // 注入全局上下文ctx中
  inject('services', services)
}
export { services }
