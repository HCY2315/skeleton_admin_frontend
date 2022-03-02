import axios from '@/libs/api.request'

// 查询组织机构、岗位数据
export const getSubListByFid = (id) => {
  return axios.get('/organization/get_by_fid',{fid:parseInt(id)})
}

// 根据组织机构、岗位 ID，查询成员列表
export const getMembersByOrgPostId = (params) => {
  return axios.get('/post_members/list',params)
}

//新增
export const create = (data) => {
  return axios.post('/post_members/create',data)
}

// 编辑、修改
export const edit = (data) => {
  return axios.post('/post_members/edit',data)
}

// 删除
export const destory = (id) => {
  return axios.post('/post_members/destroy',{id:id})
}
