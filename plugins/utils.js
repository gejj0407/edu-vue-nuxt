import {MessageBox} from 'element-ui'
import Vue from 'vue'
import moment from 'moment'
import path from 'path'
import pkg from '@/package'
import cookie from 'cookie'

/**
 * @module main/plugins/utils/index
 * @description 工具方法
 */
const utils = {
  /**
   * description 保存cookie
   * @function setCookie
   * @param {string} name cookie的键名
   * @param {string} value cookie的健值
   * @param {object} res 服务端存cookie时使用
   */
  setCookie: (name, value, res = null) => {
    name = `cube-${pkg.name}-${process.env.TYPE}-${name}`
    if (process.client) {
      document.cookie = cookie.serialize(name, value, {
        path: '/'
      })
    } else if (res) {
      res.setHeader('Set-Cookie', [cookie.serialize(name, value, {
        path: '/'
      })])
    }
  },
  setCookies(names, values, res = null) {
    if (process.client) {
      names.forEach((name, index) => {
        utils.setCookie(name, values[index])
      })
    } else if (res) {
      let array = names.map((name, index) => {
        name = `cube-${pkg.name}-${process.env.TYPE}-${name}`
        return cookie.serialize(name, values[index], {
          path: '/'
        })
      })
      res.setHeader('Set-Cookie', array)
    }
  },
  /**
   * @description 获取cookie
   * @function getCookie
   * @param {string} cookie cookie内容
   * @param {string} name cookie的键名
   * @return {string} 当前键名下的键值
   */
  getCookie: (coo, name) => {
    name = `cube-${pkg.name}-${process.env.TYPE}-${name}`
    if (!coo) {
      return ''
    }
    const cookies = cookie.parse(coo)
    return cookies[name]
  },
  /**
   * @description 当前是否是手机浏览器
   * @function isMobileBrowser
   * @param {string} userAgent userAgent
   * @return {boolean} 是否是手机浏览器
   */
  isMobileBrowser: (userAgent) => {
    const ua = userAgent.toLowerCase()
    if (
      /MicroMessenger/i.test(ua) ||
      /(iPhone|iPad|iPod|iOS)/i.test(ua) ||
      /(android|nexus)/i.test(ua) ||
      /(Windows Phone|windows[\s+]phone)/i.test(ua) ||
      /BlackBerry/i.test(ua)
    ) {
      return true
    }
    return false
  },
  /**
   * @description 是否是链接
   * @function isUrl
   * @param {string} path 链接地址
   * @return {boolean} 是否是链接
   */
  isUrl: (path) => {
    if (!path) {
      return false
    }
    const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/g
    return reg.test(path)
  },
  /**
   * @description 是否为空,0不为空
   * @function isTrueEmpty
   * @param {*} str
   * @return {boolean} 是否为空
   */
  isTrueEmpty: (str) => {
    if (str || str === 0) {
      return false
    }
    return true
  },
  /**
   * @description 是否为数字
   * @function isNumber
   * @param {*} str
   * @return {boolean} 是否为数字
   */
  isNumber: (str) => {
    if (!utils.isTrueEmpty(str)) {
      return !isNaN(str)
    }
    return false
  },
  /**
   * @description 是否为正数
   * @function isPositive
   * @param {*} str
   * @return {boolean} 是否为正数
   */
  isPositive: (str) => {
    if (utils.isNumber(str)) {
      if (str > 0) {
        return true
      }
    }
    return false
  },
  /**
   * @description 是否为负数
   * @function isNegative
   * @param {*} str
   * @return {boolean} 是否为负数
   */
  isNegative: (str) => {
    if (utils.isNumber(str)) {
      if (str < 0) {
        return true
      }
    }
    return false
  },
  /**
   * @description 是否为整数
   * @function isInteger
   * @param {*} str
   * @return {boolean} 是否为整数
   */
  isInteger: (str) => {
    if (utils.isNumber(str)) {
      if (str % 1 === 0) {
        return true
      }
    }
    return false
  },
  /**
   * @description 是否为闰年
   * @function isLeapYear
   * @param {number} year
   * @return {boolean} 是否为闰年
   */
  isLeapYear: (year) => {
    year = parseInt(year, 10)
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return true
    } else {
      return false
    }
  },
  /**
   * @description 是否为手机号
   * @function isMobilePhone
   * @param {string} value
   * @return {boolean} 是否为手机号
   */
  isMobilePhone: (value) => {
    const reg = /^1\d{10}$/
    if (reg.test(value)) {
      return true
    }
    return false
  },
  /**
   * @description 是否为座机号
   * @function isTelephone
   * @param {string} value
   * @return {boolean} 是否为座机号
   */
  isTelephone: (value) => {
    const reg = /^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/
    if (reg.test(value)) {
      return true
    }
    return false
  },
  /**
   * @description 是否为邮箱
   * @function isEmail
   * @param {string} value
   * @return {boolean} 是否为邮箱
   */
  isEmail: (value) => {
    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,}$/
    if (reg.test(value)) {
      return true
    }
    return false
  },
  /**
   * @description 是否为身份证
   * @function isIdCard
   * @param {string} value
   * @return {boolean} 是否为身份证
   */
  isIdCard: (value) => {
    const reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
    if (reg.test(value)) {
      return true
    }
    return false
  },
  /**
   * @description 根据浏览器url的键名获取query的键值
   * @function getQueryString
   * @param {string} key 键名
   * @return {string} 键值
   */
  getQueryString: (key) => {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg)
    if (r) {
      return decodeURIComponent(r[2])
    }
    return ''
  },
  /**
   * @description 确认弹框
   * @function confirm
   * @param {string} content 提示的内容
   * @param {object} options 弹框的配置
   * @param {string} options.title=提示 弹框标题
   * @param {string} options.confirmButtonText=确定 确定按钮的文案
   * @param {string} options.cancelButtonText=取消 取消按钮的文案
   * @param {string} options.type=warning 弹框的类型，可选值参考element-ui中MessageBox
   * @return {Promise<any>} 用户点击了确定还是取消
   */
  confirm: (content, options = {}) => {
    return new Promise((resolve, reject) => {
      MessageBox.confirm(content, options.title || '提示', {
        confirmButtonText: options.confirmButtonText || '确定',
        cancelButtonText: options.cancelButtonText || '取消',
        type: options.type || 'warning',
        dangerouslyUseHTMLString: options.dangerouslyUseHTMLString || false
      }).then(() => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  /**
   * @description 格式化日期为datetime格式
   * @function toDateTime
   * @param ${string} date 日期
   * @return {string} datetime格式日期
   */
  toDateTime: (date) => {
    if (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
    return ''
  },
  /**
   * @description 格式化日期为date格式
   * @function toDate
   * @param ${string} date 日期
   * @return {string} date格式日期
   */
  toDate: (date) => {
    if (date) {
      return moment(date).format('YYYY-MM-DD')
    }
    return ''
  },
  /**
   * @description 格式化日期为自定义格式
   * @function formatDate
   * @param ${string} date 日期
   * @return {string} 自定义格式日期
   */
  formatDate: (date, format) => {
    if (date) {
      return moment(date).format(format)
    }
    return ''
  },
  /**
   * @description 铺平树形结构为一维数组
   * @function flatten
   * @param {Object|Object[]} arr 树节点或树节点数组
   * @param {string} childKey=children 树子节点数组属性
   * @returns {Object[]}
   */
  flatten: (arr, childKey = 'children') => {
    const flattenArray = (arr, childKey) => {
      if (Array.isArray(arr))
        return Array.prototype.concat.apply([], arr.map(i => flattenArray(i, childKey)))
      else if (arr.hasOwnProperty(childKey))
        return [
          arr,
          ...flattenArray(arr[childKey], childKey)
        ]
      return [arr]
    }
    return flattenArray(arr, childKey)
  },
  /**
   * @description 去除菜单中的按钮，符合渲染左侧菜单的树型结构,直接修改源数据,并加上完整的路径
   * @function filterMenu
   * @param {array} array 后台返回的包括按钮的树形结构
   */
  filterMenu: (array, superPath = '/') => {
    array.forEach((item) => {
      item.fullPath = path.join(superPath, item.menuHref)
      if (item.children && item.children.length > 0) {
        if (item.children.find((child) => child.menuType === 'BUTTON')) {
          item.children = []
        } else {
          utils.filterMenu(item.children, item.fullPath)
        }
      }
    })
  },
  /**
   * @description 将后台返回的树型结构转化为只包含叶子菜单的一维数组结构并去除按钮，且加上该叶子菜单的完整路径
   * @function filterMenu2LeafArray
   * @param {array} menus 后台返回的包括按钮的树形结构
   * @param {array} init 用于递归的返回值
   * @param {string} superPath 上级路由，用于递归时拼接完整路径
   * @return {Array} 返回符合要求的一维数组
   */
  filterMenu2LeafArray: (menus, init = [], superPath = '/') => {
    menus.forEach((menu) => {
      if (menu && menu.children && menu.children.length > 0) {
        if (menu.children.find((child) => child.menuType === 'BUTTON')) {
          init = init.concat({...menu, fullPath: path.join(superPath, menu.menuHref).replace(/\\/g, '/')})
        } else {
          init = utils.filterMenu2LeafArray(menu.children, init, path.join(superPath, menu.menuHref).replace(/\\/g, '/'))
        }
      } else {
        init = init.concat({...menu, fullPath: path.join(superPath, menu.menuHref).replace(/\\/g, '/')})
      }
    })
    return init
  },
  /**
   * @description 将后台返回的树型结构转化为只包含按钮权限的一维数组
   * @param {array} menus 后台返回的包括按钮的树形结构
   * @param {array} init 用于递归的返回值
   * @return {array} 返回符合要求的一维数组
   */
  filterMenuPermissions: (menus, init = []) => {
    menus.forEach((menu) => {
      if (menu && menu.menuPermission) {
        if (!init.includes(menu.menuPermission)) {
          init.push(menu.menuPermission)
        }
      }
      if (menu && menu.children && menu.children.length > 0) {
        init = utils.filterMenuPermissions(menu.children, init)
      }
    })
    return init
  },
  downloadFile: (stream, fileName) => {
    const blob = new Blob([stream]);
    if ("download" in document.createElement("a")) {
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    } else {
      navigator.msSaveBlob(blob, fileName);
    }
  },
  // 显示textarea的值
  toTextareaText(str) {
    if (str) {
      return str.replace(/\n/g, '<br/>')
    }
    return ''
  },
  // 根据路由生成查询条件
  generateParams(params, query) {
    Object.keys(query).forEach((key) => {
      if (key === 'p') {
        params.current = query.p ? parseInt(query.p) : 1
      } else {
        params[key] = query[key] || ''
      }
    })
  },
  buildQuery(obj, query) {
    const currentQuery = query || {}
    return Object.assign({}, currentQuery, obj)
  },
  getLuoma(num, pos) {
    var gearr = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    var shiarr = ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
    var baiarr = ["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
    var qianarr = ["M", "MM", "MMM"];
    var data = [];
    data.push(gearr, shiarr, baiarr, qianarr);
    return data[pos][num];
  },
  convert(num) {
    num = parseInt(num)
    if (num > 3999 || num < 0) {
      return "超出计算范围！";
    }
    var strNum = num + "";
    var result = "";
    for (var i = 0; i < strNum.length; i++) {
      var data = strNum.charAt(i);
      if (data == "0") {
        continue;
      }
      result += utils.getLuoma(parseInt(data) - 1, strNum.length - i - 1);
    }

    return result;
  }
}

const utilsPlugin = {
  install: (Vue, options) => {
    Vue.prototype.$utils = utils
  }
}

Vue.use(utilsPlugin)

export default utils
