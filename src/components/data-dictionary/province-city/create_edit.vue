<template>
  <Drawer
    :title="CurdLayerData.name" v-model="CurdLayerData.isShow" :mask-closable=false :closable=true
    :draggable=true @on-close="drawer_close()" class="drawerLayer" :style="drawerLayerStyle"
    :width="drawerLayerStyle.width">
    <Form ref="formValidate" :model="CurdFormData" :rules="ruleValidate" label-position="left" :label-width="110">
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="父节点名称：" prop="ftitle">
            <Input disabled v-model="CurdFormData.ftitle" placeholder="">
              <Icon type="md-search" slot="suffix" @click="select_province_city()"/>
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="行政区域名：" prop="name">
            <Input v-model="CurdFormData.name" placeholder="请输入行政区域名"/>
          </FormItem>
        </Col>

      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="状态：" prop="status">
            <Select v-model="CurdFormData.status">
              <Option v-for="item in select_status" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="排序：">
            <Input v-model.number="CurdFormData.sort" placeholder="排序越大越靠前"/>
          </FormItem>
        </Col>
      </Row>

      <FormItem label="备注：">
        <Input type="textarea" v-model="CurdFormData.remark" :rows="4" placeholder="请输入备注"/>
      </FormItem>
    </Form>
    <div class="drawerFooter">
      <Button type="primary" @click="CurdLayerData.action==='create'?createSend():editSend()">{{CurdLayerData.name}}
      </Button>
    </div>

    <!--    省份城市选择 modal-->
    <Modal v-model="cityModalIsShow" draggable scrollable title="选择省份、城市" width="560" @on-ok="ok_event"
           @on-cancel="cancel_event">
      <CommonProvinceCityTree :isShow="cityModalIsShow" :ref="this.refProvinceCityTree"></CommonProvinceCityTree>
    </Modal>

  </Drawer>
</template>

<script>
import {create, edit} from '@/api/data-dictionary/province_city'
import common_func from '@/libs/common_func'
import CommonProvinceCityTree from '_c/data-dictionary/common/province_city_tree'

export default {
  name: 'createEdit',
  props: {
    CurdFormData: Object,
    CurdLayerData: Object
  },
  // 注意：新增界面的初始化函数在父页面初始化时会调用，并不是在显示的时候调用
  created() {
  },
  components: {
    CommonProvinceCityTree
  },
  watch: {},
  data() {
    return {
      // select options 可选值
      select_status: common_func.SelectStatus,
      // 省份城市公共组件ref值，必须和公共组件定义处的值保持一致
      refProvinceCityTree:"CommonProvinceCityTree",
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
        name: [
          {type: 'string', required: true, min: 2, max: 80, message: '行政区域名为必填项，规则：[2,80]个文字', trigger: 'blur'}
        ],
        ftitle: [
          {type: 'string', required: true, message: '父级节点必须选择', trigger: 'blur'}
        ],
        remark: [
          {type: 'string', max: 120, message: '备注不能超过120个字符', trigger: 'blur'}
        ]
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      // 选择省份城市框
      cityModalIsShow: false
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
      // console.log(this.CurdLayerData)
    },

    select_province_city() {
      this.cityModalIsShow = true
    },
    // 省份城市选择框相关的事件
    ok_event() {
      let selected_item = this.$refs[`${this.refProvinceCityTree}`].cur_selected_item_obj
      if (!common_func.Curd.CommonComponentSelectedCheck(this, selected_item.selected)) {
        return
      }
      this.CurdFormData.fid = selected_item.id
      this.CurdFormData.ftitle = selected_item.title
    },
    cancel_event() {
      this.$refs[`${this.refProvinceCityTree}`].cur_selected_item_obj = {}
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
