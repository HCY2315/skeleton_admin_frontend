<template>
  <div :style="{width:browse_width}">
    <LoginTitle></LoginTitle>
    <LoginForm ref="captcha" @on-success-valid="handleSubmit"></LoginForm>
    <LoginCarouse></LoginCarouse>
    <CopyRight></CopyRight>
  </div>
</template>

<script>
import LoginTitle from '_c/system-setting/login-form/login_title'
import LoginForm from '_c/system-setting/login-form/login_form'
import LoginCarouse from '_c/system-setting/login-form/login_carouse'
import CopyRight from '_c/system-setting/login-form/copy_right'
import store from '../../../store'

export default {
  components: {
    LoginForm,
    LoginCarouse,
    LoginTitle,
    CopyRight
  },
  data() {
    return {
      browse_width: this.common_func.GetBrowserWidth() + 'px'
    }
  },
  created: function () {

  },
  computed: {},
  methods: {
    handleSubmit({user_name, pass, captcha_id, captcha_value}) {
      store.dispatch('user/handleLogin', {user_name, pass, captcha_id, captcha_value}).then(res => {
        this.$router.push({
          name: this.$config.homeName
        }).catch(() => {

        })
      }).catch(errRes => {
        if (errRes.data.code == -400355) {
          this.$Message.error("验证码错误")
          this.$refs.captcha.getCaptcha()
          return
        } else if (errRes.data.code !=200) {
          this.$Message.error("登录失败,账号或密码输入错误")
          this.$refs.captcha.getCaptcha()
        }
        return
      })
    }
  }
}
</script>

<style scoped>

.system_title {
  margin-top: 150px;
}

#login-carouse {
  text-align: center;
}

/*表单登陆对话框*/
#login-form {
  position: absolute;
  margin-left: calc(100% * 0.7);
  margin-top: 110px;
  z-index: 100;
  border: solid 1px #F7F8E0;
}

</style>
