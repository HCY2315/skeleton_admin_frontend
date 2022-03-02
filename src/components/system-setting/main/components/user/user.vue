<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          编辑信息
        </DropdownItem>
        <DropdownItem name="logout" divided>退出系统</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!-- CURD 界面-->
    <edit ref="createEditRef" :CurdFormData="CurdFormData" :CurdLayerData="CurdLayerData"></edit>
  </div>
</template>

<script>
import './user.less'
import {removeToken} from '@/libs/util'
import {resetRouter} from '@/router/index'
import edit from './edit'

export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
  },
  components: {
    edit
  },
  data() {
    return {
      // 个人信息
      CurdFormData: {
        id: 0,
        user_name: "",
        pass: "",
        phone: "",
        fk_customer_id: 0,
        real_name: "",
        avatar: "",
        status: 1,
        login_times: 0,
      },
      CurdLayerData: {
        isShow: false,
        action: 'edit', // create 、Edit
        title: '修改'// 新增 、修改
      },
    }
  },

  methods: {
    logout() {
      removeToken()
      this.$store.dispatch("user/setHasGetInfos")
      this.$store.dispatch("routes/resetUserMenu")
      resetRouter()
      this.$router.push({
        name: 'login'
      }).catch(() => {
      })
    },
    message() {
      this.CurdLayerData.isShow = true
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    }
  }
}
</script>
