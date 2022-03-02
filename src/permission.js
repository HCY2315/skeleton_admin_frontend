import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/libs/util'
// import Main from '@/components/main'
// import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next(`/home`)
      NProgress.done()
    }else if(to.path === from.path){

    }else {
      const hasGetUserInfo = store.getters.hasGetInfo
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // TODO: 动态生成路由问题
          // get user info
          store.dispatch('user/getUserInfo').then(() => {
            // const newRouter = createNewRouter()
            // router.matcher = newRouter.matcher // reset router
           router.addRoutes(store.getters.menus, { override: true })
           router.addRoute({
                path: '*',
                name: 'error_404',
                meta: {
                  hideInMenu: true,
                },
                component: () => import('@/view/system-setting/error-page/404.vue')
              }
            )
            next({ ...to, replace: true })
          })
          // next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          //   await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
