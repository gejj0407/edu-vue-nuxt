import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import environment from '@/environments'
import utils from '@/plugins/utils'
import { Base64 } from 'js-base64';

/* eslint-disable */
let http = null

const httpPlugin = {
  refreshing: false,
  refreshFail: false,
  returnCase: {
    // -----------------------对应的返回请求上的httpStatus 为401-------------------------------
    '3016': '登录过期',
    '3017': '未知的appId',
    '3018': 'header里没有找到参数appId',
    '3019': 'token里的tenantCode与 spaceUri里的tenantCode不一致',
    '3020': '当前spaceUri下无法找到有效身份（切换身份时）',
    '3021': '根据spaceUri未匹配到InstanceCode、TenantCode、SpaceCode',
    '3022': 'header里没有找到参数spaceUri',
    // -----------------------对应的返回请求上的httpStatus 为401-------------------------------
  }
}

export default ({ redirect, route, store, res, req, params, error }) => {
  const setToken = (token, refreshToken) => {
    store.commit('account/SET_TOKEN', token)
    store.commit('account/SET_REFRESH_TOKEN', refreshToken)
    utils.setCookies(['access-token', 'refresh-token'], [token, refreshToken], res)
  }

  const dealRedirect = (url) => {
    const currentPath = route.fullPath
    if (currentPath.indexOf('?redirect_uri=') === -1 && route.path !== '/login' && url !== 'uaa/api/current-user') {
      redirect(`/login?redirect_uri=${encodeURIComponent(currentPath)}`)
    }
  }

  const httpCopy = async (method, url, request) => {
    try {
      if (request) {
        if (request.warning !== false) {
          request.warning = true
        }
        if (request.init !== true) {
          request.init = false
        }
        if (!request.contentType) {
          request.contentType = 'application/json'
        }
        if (!request.responseType) {
          request.responseType = 'json'
        }
      } else {
        request = {
          contentType: 'application/json',
          responseType: 'json'
        }
      }
      const token = store.state.account.access_token
      const headers = {
        Authorization: request.basicToken ? `Basic ${Base64.encode(environment.clientId + ':' + environment.secret)}` : `Bearer ${token}`,
        'Content-Type': request.contentType,
        tenantCode: 'swyy'
      }
      const resp = await axios({
        method,
        url,
        data: request ? request.data : null,
        params: request ? request.params : null,
        baseURL: `${environment.httpBaseUri}`,
        timeout: 120000,
        headers,
        responseType: request.responseType,
        validateStatus:
          (status) => {
            return true
          },
        onUploadProgress:
          request.onUploadProgress || null
      })
      const { status, data } = resp
      if (status.toString().startsWith('20')) {
        if (request.responseType === 'json') {
          if (data.returnCode.startsWith('2')) {
            return {
              status: 1,
              ...data
            }
          } else {
            if (process.client) {
              if (data.returnCode.toString() === '3000') {
                for (let i of [].concat(data.data)) {
                  await Message.warning(`${i.errorMessage}`)
                }
              } else {
                if (data.data) {
                  Message.error(data.data)
                }
              }
            }
            return {
              status: 2,
              ...data
            }
          }
        } else {
          return {
            status: 1,
            data: data
          }
        }
      } else if (
        data.returnCode === '401' &&
        url !== 'uaa/api/refresh-token' &&
        !httpPlugin.refreshFail
      ) {
        // 此处为token过期 处理token刷新的逻辑 并返回值 1秒的心跳
        if (httpPlugin.refreshing || store.state.account.access_token !== token) {
          if (httpPlugin.refreshFail) {
            throw new Error('401')
          } else {
            return new Promise((resolve, reject) => {
              setTimeout(async () => {
                if (!httpPlugin.refreshFail) {
                  resolve(await httpCopy(method, url, request))
                } else {
                  throw new Error('401')
                }
              }, 1000)
            })
          }
        } else {
          httpPlugin.refreshFail = false
          httpPlugin.refreshing = true
          const { status, data } = await httpCopy(
            'post',
            'uaa/api/refresh-token',
            { data: { refreshToken: store.state.account.refresh_token }, basicToken: true }
          )
          if (status === 1) {
            setToken(data.access_token, data.refresh_token)
            httpPlugin.refreshing = false
            return await httpCopy(method, url, request)
          } else {
            console.log(3333)
            httpPlugin.refreshFail = true
            httpPlugin.refreshing = false
            dealRedirect(url)
            return {
              status: 3,
              returnCode: '0',
              data: '401'
            }
          }
        }
      } else {
        throw new Error(status)
      }
    } catch (e) {
      if (e.toString().includes('Network Error')) {
        if (process.client) {
          Message.error('服务器连接失败！')
        }
      } else if (e.toString().includes('500')) {
        if (process.client) {
          Message.error('服务器内部错误！')
        }
        if (!!request && request.init) {
          error({
            statusCode: 500,
            message: '服务器内部错误'
          })
        }
      } else if (e.toString().includes('404')) {
        if (process.client) {
          Message.error('api地址不存在！')
        }
        if (!!request && request.init) {
          error({
            statusCode: 404,
            message: '资源不存在'
          })
        }
      } else if (e.toString().includes('401')) {
        if (process.client) {
          Message.error('没有访问权限！')
        }
        dealRedirect(url)
      } else {
      }
      return {
        status: 3,
        returnCode: '0',
        data: e.toString()
      }
    }
  }

  httpPlugin.install = (Vue, options) => {
    Vue.prototype.$http = httpCopy
  }

  Vue.use(httpPlugin)

  http = httpCopy
}

export { http }
