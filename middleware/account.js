/**
 * @module main/middleware/account
 * @description 判断是否登录的middleware
 */
export default function ({ store, req, redirect }) {
  if (!store.state.account.access_token) {
    return redirect('/login')
  }
}
