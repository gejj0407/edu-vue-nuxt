import { http } from '@/plugins/http'
export default {
  getList(params) {
    return http('get', '/content/api/ua/event/page', { params })
  }
}
