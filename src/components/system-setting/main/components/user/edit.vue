<template>
  <div>
    <Drawer
      :title="CurdLayerData.title" v-model="CurdLayerData.isShow" :mask-closable=false :closable=true
      :draggable=true @on-close="drawer_close()" :style="drawerLayerStyle" :width="drawerLayerStyle.width">
      <Form ref="formValidate" :model="CurdFormData" :rules="ruleValidate" label-position="left" :label-width="110">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="用户名：" prop="user_name">
              <Input v-model="CurdFormData.user_name" placeholder="用户名">
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="姓名：" prop="real_name">
              <Input v-model="CurdFormData.real_name" placeholder="真实姓名"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="密码：" prop="pass">
              <Input :type="InputType" v-model="CurdFormData.pass" placeholder="密码">
                <Icon :type="eyeWatchStyle" slot="suffix" @click="inputPassChangeStyle"/>
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="联系方式：" prop="phone">
              <Input v-model="CurdFormData.phone" placeholder="联系方式"/>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="头像">
          <Row :gutter="32">
            <Col span="12">
              <UploadFile :src.sync="picFullPath" :savePath.sync="CurdFormData.avatar"></UploadFile>
            </Col>
            <Col span="12">
              <FormItem label="">
                <img :src="picFullPath" style="width:250px;height:250px" alt=""/>
              </FormItem>
            </Col>
          </Row>

        </FormItem>
      </Form>
      <div class="drawerFooter">
        <Button type="primary" @click="CurdLayerData.action==='create'?createSend():editSend()">{{ CurdLayerData.title }}
        </Button>
      </div>
    </Drawer>
  </div>

</template>

<script>
import {personal_info,personal_edit} from '@/api/system-setting/user'
import common_func from '@/libs/common_func'
import UploadFile from '_c/common/upload_file'

export default {
  name: 'edit',
  props: {
    CurdFormData: Object,
    CurdLayerData: Object
  },
  // 注意：新增界面的初始化函数在父页面初始化时会调用，并不是在显示的时候调用
  created() {

  },
  mounted() {

  },
  components: {
    UploadFile
  },
  watch: {
    CurdFormData: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        // console.log(old_value, new_value)
      }
    },
    CurdLayerData: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        // 多选模式弹出选择框
        if (this.CurdLayerData.isShow && old_value !== undefined) {
          // 请求接口获取个人信息
          personal_info().then(res => {
            if (res.data.code === 200) {
              this.CurdFormData.id = res.data.data.id
              this.CurdFormData.user_name = res.data.data.user_name
              this.CurdFormData.real_name = res.data.data.real_name
              this.CurdFormData.login_times = res.data.data.login_times
              this.CurdFormData.fk_customer_id = res.data.data.fk_customer_id
              this.CurdFormData.pass = "####*****####"  //  密码默认使用统一的特殊符号代替，如果是默认密码，后台就不会修改
              this.CurdFormData.status = 1
              this.CurdFormData.phone = res.data.data.phone
              this.CurdFormData.avatar = res.data.data.avatar
              this.picFullPath = common_func.GetPublicPath() + this.CurdFormData.avatar
            }
          }).catch(res => {
            // console.log("异常", res)
          })
        }
      }
    }
  },
  data() {
    return {
      picFullPath: "",//图片显示地址
      // 密码框增加眼睛查看功能
      InputType: 'password',   //  text
      eyeWatchStyle: 'md-eye',   //  密码隐藏md-eye 、密码可查看 ios-eye-off
      // select options 可选值
      select_status: common_func.SelectStatus,
      // 抽屉层样式
      drawerLayerStyle: {
        height: common_func.GetBrowserHeight() + 'px',
        width: (common_func.GetBrowserWidth() - 900),
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '20px',
        position: 'static'
      },
      ruleValidate: {
        user_name: [
          {type: 'string', required: true, min: 2, max: 40, message: '用户名必填，规则：[2,40]个文字', trigger: 'blur'}
        ],
        pass: [
          {type: 'string', required: true, min: 6, max: 40, message: '密码必填，规则：[6,40]个文字', trigger: 'blur'}
        ],
        real_name: [
          {type: 'string', required: true, min: 2, max: 40, message: '姓名必填，规则：[2,40]个文字', trigger: 'blur'}
        ],
        status: [
          {type: 'number', required: true, min: 1, message: '状态值异常，不允许修改', trigger: 'blur'}
        ],
        avatar: [
          {type: 'string', rrequired: true, message: '头像必须上传', trigger: 'blur'},
        ],
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      commonOrgTree: {
        is_show: false,
        ref: 'commonOrgTree'
      }
    }
  },
  computed: {},
  methods: {
    editSend() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          personal_edit(this.CurdFormData).then(res => {
            if (res.data.code === 200) {
              common_func.Curd.SuccessTips(this, res.data.msg)
              // 刷新主界面数据
              //this.$emit('create_edit_after')
            } else {
              common_func.Curd.FailTips(this, res.data.msg)
            }
          }).catch(res => {
            common_func.Curd.FailTips(this, res.data.msg)
          })
        }
      })
    },
    drawer_close() {
      // 关闭回调事件
      // console.log(this.CurdLayerData)
    },
    handleSuccess(res, file) {
      this.CurdFormData.avatar = file.response.data.path
      this.headerImg = this.picUrl + this.CurdFormData.avatar
    },
    // 密码框支持眼睛查看功能
    inputPassChangeStyle() {
      this.InputType = (this.InputType === 'text' ? 'password' : 'text')  //  密码隐藏md-eye 、密码可查看 ios-eye-off
      this.eyeWatchStyle = (this.eyeWatchStyle === 'md-eye' ? 'ios-eye-off' : 'md-eye')   //  密码隐藏md-eye 、密码可查看 ios-eye-off
    },
  }
}
</script>

<style scoped>

</style>
