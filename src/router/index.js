import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
const createRouter = () => new Router({
  mode: 'history',
  routes: routes,
  scrollBehavior: () => ({ y: 0 }),
})
const router = createRouter()
export const  resetRouter =  () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
export default router
