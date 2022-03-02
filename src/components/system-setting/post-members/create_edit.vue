<template>
  <div>
    <!--    新增、修改 弹出界面-->
    <Drawer
      :title="CurdLayerData.title" v-model="CurdLayerData.isShow" :mask-closable=false :closable=true
      :draggable=true @on-close="drawer_close()" :style="drawerLayerStyle" :width="drawerLayerStyle.width">
      <Form ref="formValidate" :model="CurdFormData" :rules="ruleValidate" label-position="left" :label-width="110">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="岗位名称：" prop="post_name">
              <Input disabled v-model="CurdFormData.post_name" placeholder="">
                <Icon type="md-search" slot="suffix" @click="select_org_post()"/>
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户姓名：" prop="real_name">
              <Input v-model="CurdFormData.real_name" placeholder="请选择用户" disabled>
                <Icon type="md-search" slot="suffix" @click="select_user()"/>
              </Input>
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

        <FormItem label="备注：">
          <Input type="textarea" v-model="CurdFormData.remark" :rows="4" placeholder="请输入备注"/>
        </FormItem>
      </Form>
      <div class="drawerFooter">
        <Button type="primary" @click="CurdLayerData.action==='create'?createSend():editSend()">{{ CurdLayerData.title }}</Button>
      </div>
    </Drawer>

    <!--    用户选择 modal-->
    <Modal v-model="userModalIsShow" draggable scrollable title="选择用户" width="1000" @on-ok="ok_event" @on-cancel="cancel_event">
      <CommonUsers :isShow="userModalIsShow" selectPattern="one" :ref="this.commonUser"></CommonUsers>
    </Modal>

    <!--    组织机构选择 modal-->
    <Modal v-model="orgPostTreeIsShow" draggable scrollable title="选择岗位" width="560" @on-ok="ok_event_org_post" @on-cancel="cancel_event_org_post">
      <CommonOrgTree :isShow="orgPostTreeIsShow" :ref="this.CommonOrgTree"></CommonOrgTree>
    </Modal>

  </div>

</template>

<script>
import {create, edit} from '@/api/system-setting/postMembers'
import common_func from '@/libs/common_func'
import CommonUsers from '_c/system-setting/common/users'
import CommonOrgTree from '_c/system-setting/common/org_post_tree'

export default {
  name: 'createEdit',
  props: {
    CurdFormData: Object,
    CurdLayerData: Object
  },
  // 注意：新增界面的初始化函数在父页面初始化时会调用，并不是在显示的时候调用
  created() {
  },
  mounted() {
  },
  watch: {
    CurdFormData: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        // console.log(old_value, new_value)
      }
    }
  },
  components: {
    CommonUsers,
    CommonOrgTree
  },
  data() {
    return {
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
        post_name: [
          {type: 'string', required: true, message: '必须选择岗位', trigger: 'blur'}
        ],
        real_name: [
          {type: 'string', required: true, message: '必须选择用户', trigger: 'blur'}
        ],
        status: [
          {type: 'number', required: true, message: '状态必须选择', trigger: 'blur'}
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
      // 选择用户框
      userModalIsShow: false,
      // 选择组织机构
      orgPostTreeIsShow: false,

      //定义引用的公共组件ref
      commonUser: "commonUser",
      CommonOrgTree: "CommonOrgTree",
    }
  },
  methods: {
    // 选择用户
    select_user() {
      this.userModalIsShow = true
    },
    // 选择组织机构
    select_org_post() {
      this.orgPostTreeIsShow = true
    },
    ok_event() {
      //selectedRows 多选模式被勾选的数据全部存储在该变量，单选模式只有一条，存储格式为数组
      // cur_selected_item_obj 单选模式、多选模式只有一条，存储格式为一条数据的对象
      if (!common_func.Curd.CommonComponentSelectedCheck(this, this.$refs[`${this.commonUser}`].selectedRows.length === 1)) {
        return
      }

      let item = this.$refs[`${this.commonUser}`].cur_selected_item_obj
      this.CurdFormData.user_id = item.id
      this.CurdFormData.real_name = item.real_name
      this.CurdFormData.user_name = item.user_name

      // 如果是多选模式可以快捷获取选中的结果，例如：
      // let items = this.$refs[`${this.commonUser}`].selectedRows
      // let {id,user_name}=common_func.GetArrayColumnConcatVals(items,"id","user_name") // 可以一次性指定多个字段，一次性获取相关字段的数组值
      // console.log(id.toString())  // 返回选中的id字段拼接值：1,3
      // console.log(user_name.toString())// 返回选中的user_name字段拼接值：admin,boshi

    },
    cancel_event() {
      this.$refs[`${this.commonUser}`].selectedRows = []
    },
    ok_event_org_post() {
      if (!common_func.Curd.CommonComponentSelectedCheck(this, this.$refs[`${this.CommonOrgTree}`].cur_selected_item_obj.selected)) {
        return
      }
      let item = this.$refs[`${this.CommonOrgTree}`].cur_selected_item_obj
      this.CurdFormData.org_post_id = item.id
      this.CurdFormData.post_name = item.title
    },
    cancel_event_org_post() {
      this.$refs[`${this.CommonOrgTree}`].cur_selected_item_obj = {}
    },
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
              // 刷新主界面数据
              this.$emit('create_edit_after')
              common_func.Curd.SuccessTips(this, res.data.msg)
            }
          }).catch(res => {
            common_func.Curd.FailTips(this, res.data.msg)
          })
        }
      })
    },
    drawer_close() {
      // 关闭回调事件

    }
  }
}
</script>

<style scoped>

</style>
