import axios from '@/libs/api.request'

// 为组织机构分配菜单、按钮权限
export const AssginMenuToOrg = (data) => {
  return axios.post('/system_menu/assgin_to_org',data)
}

// 删除已分配权限给组织机构的菜单、按钮权限
export const DelMenuAuthFromOrg = (data) => {
  return axios.post('/system_menu/del_auth_from_org',data)
}

// 待分配权限列表
export const getSystemMenuTree = () => {
  return axios.get('/system_menu/all_list',{})
}
// 已分配给部门、岗位的菜单、按钮权限列表
export const getAssginedystemMenuTree = (org_post_id) => {
  return axios.get('/system_menu/assgined_list',{org_post_id:org_post_id})
}
