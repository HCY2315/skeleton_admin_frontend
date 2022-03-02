<template>
  <div id="login-form">
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="user_name">
        <Input v-model="form.user_name" placeholder="请输入用户名">
          <span slot="prepend">
            <Icon :size="16" type="ios-person"></Icon>
          </span>
        </Input>
      </FormItem>
      <FormItem prop="pass">
        <Input type="password" v-model="form.pass" placeholder="请输入密码">
          <span slot="prepend">
            <Icon :size="14" type="md-lock"></Icon>
          </span>
        </Input>
      </FormItem>
      <FormItem>
        <Row>
          <Col span="12">
            <Input style="width: 200px" v-model="form.captcha_value" placeholder="输入验证码">
                  <span slot="prepend">
                      <Icon :size="16" type="md-apps"></Icon>
                  </span>
            </Input>
          </Col>
          <Col span="12">
            <img v-if="imgShow" @click="flushCaptcha" style="width:150px;height:30px;float:left;margin-left:20px" :src="'data:image/png;base64,'+imgData">
          </Col>
        </Row>


      </FormItem>

      <FormItem>
        <Button @click="handleSubmit" type="primary" long>登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {check, get, getImg} from "@/api/system-setting/captcha"
import config from '@/config/index'

export default {
  name: 'LoginForm',
  created: function () {
    this.getCaptcha()
  },
  props: {
    user_nameRules: {
      type: Array,
      default: () => {
        return [
          {required: true, message: '账号不能为空', trigger: 'blur'}
        ]
      }
    },
    passRules: {
      type: Array,
      default: () => {
        return [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  data() {
    return {
      imgShow:false,
      captchaId: "",
      captchaUrl: "",
      captchaFlushUrl: "",
      imgData: "",
      isShow: true,
      form: {
        user_name: config.login_params.user_name,
        pass: config.login_params.pass,
        captcha_id : "",
        captcha_value: ""
      }
    }
  },
  computed: {
    rules() {
      return {
        user_name: this.user_nameRules,
        pass: this.passRules
      }
    }
  },
  methods: {
    //  首先获取验证码
    getCaptcha() {
      get().then(res => {
        this.form.captcha_id = res.data.data.id
        this.captchaUrl = res.data.data.img_url
        this.captchaFlushUrl = res.data.data.refresh
        getImg(this.captchaUrl).then(res => {
          this.imgData = new Buffer(res.data, 'binary').toString('base64')
          this.imgShow = true
        })
        this.form.captcha_value = ""
      })
    },
    // 根据验证码ID刷新验证码，获取下一个值
    flushCaptcha() {
      getImg(this.captchaFlushUrl).then(res => {
        this.imgData = new Buffer(res.data, 'binary').toString('base64')
        this.form.captcha_value = ""
      })
    } ,
    // 登陆参数、验证码参数一起提交
    handleSubmit() {
      if (this.form.captcha_value.length == 0) {
        this.$Message.error('请输入验证码')
        return
      }
      // 提交参数
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            user_name: this.form.user_name,
            pass: this.form.pass,
            captcha_id: this.form.captcha_id,
            captcha_value: this.form.captcha_value,
          })
        }
      })
    }
  }
}
</script>

<style scoped>
#login-form {
  display: inline-block;
  padding: 30px 20px;
  text-align: center;
  width: 420px;
  height: 310px;
  line-height: 310px;
  vertical-align: middle;
  background: #F9F9F9;
  border-radius: 6px;
}
</style>
