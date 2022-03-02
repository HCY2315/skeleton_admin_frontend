const getters = {
  menus: state => state.routes.menus,
  name: state => state.user.user_name,
  hasGetInfo: state => state.user.hasGetInfo
}
export default getters
