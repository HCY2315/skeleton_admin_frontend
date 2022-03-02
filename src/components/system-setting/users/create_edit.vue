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
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="状态：" prop="status">
              <Select v-model.number="CurdFormData.status">
                <Option v-for="item in select_status" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="头像">
          <Row :gutter="32">
            <Col span="12">
          <!-- src 是文件上传后的完整路径，如果上传的是图片，需要接受该属性，其他地方可以显示图片; 如果是上传的是文件，该属性直接省略即可-->
              <UploadFile :src.sync="src" :savePath.sync="CurdFormData.avatar"></UploadFile>
            </Col>
            <Col span="12">
              <FormItem label="">
                <img :src="src" style="width:350px;height:240px" alt=""/>
              </FormItem>
            </Col>

          </Row>
          <Input style="display:none" v-model="CurdFormData.avatar" :rows="4"/>
        </FormItem>
        <FormItem label="备注：">
          <Input type="textarea" v-model="CurdFormData.remark" :rows="4" placeholder="请输入备注"/>
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
import {create, edit} from '@/api/system-setting/user'
import common_func from '@/libs/common_func'
import UploadFile from '_c/common/upload_file'

export default {
  name: 'createEdit',
  props: {
    CurdFormData: Object,
    CurdLayerData: Object
  },
  components: {
    UploadFile
  },
  // 注意：新增界面的初始化函数在父页面初始化时会调用，并不是在显示的时候调用
  created() {

  },
  mounted() {
  },
  watch: {

  },
  data() {
    return {
      src: "",//图片显示地址
      // 密码框增加眼睛查看功能
      InputType: 'password',   //  text
      eyeWatchStyle: 'md-eye',   //  密码隐藏md-eye 、密码可查看 ios-eye-off
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
          {type: 'number', required: true, message: '状态必须选择', trigger: 'blur'}
        ],
        avatar: [
          {type: 'string', rrequired: true, message: '头像必须上传', trigger: 'blur'},
        ],
        remark: [
          {type: 'string', max: 300, message: '备注不能超过300个字符', trigger: 'blur'}
        ]
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
    createSend() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          create(this.CurdFormData).then(res => {
            if (res.data.code === 200) {
              common_func.Curd.SuccessTips(this, res.data.msg)
              // 刷新主界面数据
              this.$emit('create_edit_after')
            }
          }).catch(res => {
            common_func.Curd.FailTips(this, res.data.msg)
          })
        }
      })
    },
    editSend() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          edit(this.CurdFormData).then(res => {
            if (res.data.code === 200) {
              common_func.Curd.SuccessTips(this, res.data.msg)
              // 刷新主界面数据
              this.$emit('create_edit_after')
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
    ok_event() {
      if (!common_func.Curd.CommonComponentSelectedCheck(this, this.$refs.commonOrgTree.cur_item.id >= 0)) {
        return
      }
      let item = this.$refs.commonOrgTree.cur_item
      this.CurdFormData.org_post_name = item.title
      this.CurdFormData.org_post_id = item.id
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
