import axios from '@/libs/api.request'

export const common_user_list = (params) => {
  return axios.get('users/list', params)
}
