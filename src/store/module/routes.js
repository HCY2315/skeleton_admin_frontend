
import Main from '@/components/system-setting/main'

function map2Router(menus) {
  const routers = []
  for (let i = 0; i < menus.length; i++) {
    let sub_menus = []
    if (menus[i].children) {
      sub_menus = map2Router(menus[i].children)
    }
    const temp = {
      name: menus[i].name,
      path: menus[i].path.charAt(0) !== "/"?"/" + menus[i].path: menus[i].path,
      component: menus[i].fid === 0 ? Main : () => import ('@/' + menus[i].component),
      icon: menus[i].icon,
      meta: { icon: menus[i].icon, title: menus[i].title,menuId: menus[i].id},
      children: sub_menus,
      redirect: menus[i].redirect ? menus[i].redirect : ''
    }
    routers.push(temp)
  }

  return routers
}

const state = {
  menus: []
}

const mutations = {
  SET_USER_MENU: (state, menus) => {

    state.menus = state.menus.concat(menus)
  },
  RSET_USER_MENU: (state, menus) => {

    state.menus = []
  }
}

const actions = {
  // get user info
  setUsermenu({ commit, state }, menus) {
    return new Promise((resolve, reject) => {
      commit('SET_USER_MENU', map2Router(menus))
    })
  },
  resetUserMenu({ commit, state }, menus) {
    commit('RSET_USER_MENU')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
