<template>
  <div>
    <Drawer
      :title="CurdLayerData.title" v-model="CurdLayerData.isShow" :mask-closable=false :closable=true
      :draggable=true @on-close="drawer_close()" class="drawerLayer" :style="drawerLayerStyle" :width="drawerLayerStyle.width">
      <Form ref="formValidate" :model="CurdFormData" :rules="ruleValidate" label-position="left" :label-width="110">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="父节点名称：" prop="ftitle">
              <Input disabled v-model="CurdFormData.ftitle" placeholder="">
                <Icon type="md-search" slot="suffix" @click="select_org_post()"/>
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="组织机构名称：" prop="title">
              <Input v-model="CurdFormData.title" placeholder="请输入组织机构名称"/>
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
      <!--    组织机构选择 modal-->
      <Modal v-model="orgPostTreeIsShow" draggable scrollable title="选择组织机构" width="560" @on-ok="ok_event_org_post" @on-cancel="cancel_event_org_post">
        <CommonOrgTree :isShow="orgPostTreeIsShow" :ref="this.refCommonOrgTree"></CommonOrgTree>
      </Modal>

    </Drawer>
  </div>
</template>

<script>
import {create, edit} from '@/api/system-setting/org'
import common_func from '@/libs/common_func'
import CommonOrgTree from '_c/system-setting/common/org_post_tree'

export default {
  name: 'createEdit',
  props: {
    CurdFormData: Object,
    CurdLayerData: Object
  },
  // 注意：新增界面的初始化函数在父页面初始化时会调用，并不是在显示的时候调用
  components: {
    CommonOrgTree
  },
  watch: {},
  data() {
    return {
      orgPostTreeIsShow: false,
      select_status: common_func.SelectStatus,
      refCommonOrgTree: "CommonOrgTree",
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
        ftitle: [
          {type: 'string', required: true, message: '上级节点为必填选项', trigger: 'blur'}
        ],
        title: [
          {type: 'string', required: true, min: 1, max: 60, message: '组织机构名称为必填选项，规则：[,40]个文字', trigger: 'blur'}
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
      }
    }
  },
  methods: {
    createSend() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          create(this.CurdFormData).then(res => {
            if (res.data.code === 200) {
              common_func.Curd.SuccessTips(this, res.data.msg)
              // 刷新主界面数据
              this.$emit('create_edit_after')
            } else {
              common_func.Curd.FailTips(this, res.data.msg)
            }
          }).catch(res => {
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
          })
        }
      })
    },
    drawer_close() {
      // 关闭回调事件

    },
    select_org_post() {
      this.orgPostTreeIsShow = true
    },
    ok_event_org_post() {
      if (!common_func.Curd.CommonComponentSelectedCheck(this, this.$refs[`${this.refCommonOrgTree}`].cur_selected_item_obj.selected)) {
        return
      }
      let item = this.$refs[`${this.refCommonOrgTree}`].cur_selected_item_obj
      this.CurdFormData.fid = item.id
      this.CurdFormData.ftitle = item.title
    },
    cancel_event_org_post() {
      this.$refs[`${this.refCommonOrgTree}`].cur_selected_item_obj = {}
    },
  }
}
</script>

<style scoped>
.drawerLayer {
  height: calc(100% - 55px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px;
  position: static
}

</style>
