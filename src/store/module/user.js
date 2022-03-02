// import {getContentByMsgId, getMessage, getUnreadCount, hasRead, login, removeReaded, restoreTrash} from '@/api/user'
import {login, getUserInfo} from '@/api/system-setting/user'
import {getToken, setToken} from '@/libs/util'
import common_func from '@/libs/common_func'
export default {
  state: {
    user_name: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.user_name = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setMessageCount(state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList(state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList(state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore(state, {msg_id, content}) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg(state, {from, to, msg_id}) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin({commit}, {user_name, pass,captcha_id,captcha_value}) {
      user_name = user_name.trim()
      return new Promise((resolve, reject) => {
        login({
          user_name,
          pass,
          captcha_id,
          captcha_value
        }).then(res => {
          const data = res.data
          commit('setToken', data.data.token)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut() {
      // 用户退出一般都是直接关闭浏览器，此处逻辑并无实质意义

    },
    setHasGetInfos({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        try {
          commit('setHasGetInfo', false)
        } catch (error) {
          reject(error)
        }
      })
    },
    //获取用户相关信息
    getUserInfo({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(Response => {
            const { data } = Response
            let info = data.data
            if (!info) {
              reject('验证失败, 请重新登录.')
            }
            commit('setUserName', info.user_name)
            commit('setUserId', info.id)
            commit('setAvator', common_func.GetPublicPath()+info.avatar)
            commit('setAccess', [])
            commit('setHasGetInfo', true)
            let menus = info.menus
            dispatch('routes/setUsermenu', menus, { root: true })
            resolve(data)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
  },
  namespaced: true
}
