<template>
  <Drawer
    :title="CurdLayerData.title" v-model="CurdLayerData.isShow" :mask-closable=false :closable=true
    :draggable=true @on-close="drawer_close()" class="" :style="drawerLayerStyle" :width="drawerLayerStyle.width">
    <Form ref="formValidate" :model="CurdFormData" :rules="ruleValidate" label-position="left" :label-width="110">
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="父节点名称：" prop="ftitle">
            <Input disabled v-model="CurdFormData.ftitle" placeholder="">
              <Icon type="md-search" slot="suffix" @click="select_system_menu()"/>
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="菜单名称：" prop="title">
            <Input v-model="CurdFormData.title" placeholder="请输入菜单名称"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="路由名称：" prop="name">
            <Input v-model="CurdFormData.name" placeholder=""/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="路由路径：" prop="path">
            <Input v-model="CurdFormData.path" placeholder="请输入菜单名称"/>
          </FormItem>
        </Col>

      </Row>

      <Row :gutter="32">
        <Col span="12">
          <FormItem label="图标：">
            <Input v-model="CurdFormData.icon" placeholder=""/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="状态：">
            <Select v-model.number="CurdFormData.status">
              <Option v-for="item in select_status" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="32">
        <Col span="12">
          <FormItem label="视图组件：" prop="component">
            <Input v-model="CurdFormData.component" placeholder=""/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="排序：" prop="sort">
            <Input type="number" v-model.number="CurdFormData.sort" placeholder="子级菜单的排序值必须 <= 父级菜单的排序值"/>
          </FormItem>
        </Col>
      </Row>

      <FormItem label="备注：">
        <Input type="textarea" v-model="CurdFormData.remark" :rows="4" placeholder="请输入备注"/>
      </FormItem>
      <Divider plain>菜单页可操作按钮编辑</Divider>
      <ChildrenTable :formInfo="formInfo"></ChildrenTable>
    </Form>
    <div class="drawerFooter">
      <Button type="primary" @click="CurdLayerData.action==='create'?createSend():editSend()">{{ CurdLayerData.title }}
      </Button>
    </div>
    

    <!--   系统菜单选择 modal-->
    <Modal v-model="systemMenuTreeIsShow" draggable scrollable title="选择上级菜单" width="560" @on-ok="ok_event_system_menu" @on-cancel="cancel_event_system_menu">
      <CommonSystemMenuTree :isShow="systemMenuTreeIsShow" :ref="this.refCommonSystemMenuTree"></CommonSystemMenuTree>
    </Modal>

  </Drawer>
</template>

<script>
import {create_json, edit_json} from '@/api/system-setting/system_menu'
import common_func from '@/libs/common_func'
import ChildrenTable from '_c/system-setting/common/children_table'
import CommonSystemMenuTree from '_c/system-setting/common/system_menu_tree'

export default {
  name: 'createEdit',
  components: {
    ChildrenTable,
    CommonSystemMenuTree
  },
  props: {
    CurdFormData: Object,
    CurdLayerData: Object
  },
  // 注意：新增界面的初始化函数在父页面初始化时会调用，并不是在显示的时候调用
  created() {
  },
  watch: {},
  data() {
    return {
      systemMenuTreeIsShow: false,
      // 公共组件的ref，必须和原始公共组件的ref值保持一致
      refCommonSystemMenuTree: "CommonSystemMenuTree",
      formInfo: {
        //子表一行表单拥有的字段
        formDataItem: {
          id: 0,
          fr_auth_system_menu_id: 0,
          fr_auth_button_cn_en_id: 0,
          button_name: '',
          request_url: '/',
          request_method: "",
          remark: ''
        },
        //表单类型和总数
        tableCols: [
          {
            name: '按钮名称',//表单名称
            type: "dialog",//类型{弹出框}
            field: 'button_name',//字段名
            componentPath: '_c/system-setting/common/button_cn_en',
            width: '6',//宽度,参考iview的col  row  ,一行值共计24
            modalWidth: '900px', // 弹出框宽度
            //字段与弹出框组件字段的映射
            map: {
              fr_auth_button_cn_en_id: 'id',
              button_name: 'cn_name',
              request_method: 'allow_method'
            }
          },
          {
            name: '接口地址',
            type: "string",
            field: 'request_url',
            width: '5',
          },
          {
            name: '接口允许请求方式',
            type: "selectString",
            field: 'request_method',
            width: '4',
            option: [
              '*',
              'GET',
              'POST'
            ]
          },
          {
            name: '备注',
            type: "string",
            field: 'remark',
            width: '5',
          },
        ],
        resultArr: [],  //结果集,子表所有的数据都在这里
        deleteString: '',  //修改时,如果子表涉及到删除,则删除的ids在这里
        //这里是新增的时候,给一个默认的值
        defaultCreate: [
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 1,
            button_name: '新增',
            request_url: '/',
            request_method: "POST",
            remark: ''
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 2,
            button_name: '删除',
            request_url: '/',
            request_method: "POST",
            remark: ''
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 3,
            button_name: '修改',
            request_url: '/',
            request_method: "POST",
            remark: ''
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 4,
            button_name: '查询',
            request_url: '/',
            request_method: "GET",
            remark: ''
          },
        ],
      },
      select_status: common_func.SelectStatus,
      // 抽屉层样式
      drawerLayerStyle: {
        height: common_func.GetBrowserHeight() + 'px',
        width: (common_func.GetBrowserWidth() - 800),
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '20px',
        position: 'static'
      },
      ruleValidate: {
        title: [
          {type: 'string', required: true, min: 2, max: 100, message: '菜单名称必须, 规则：[2,100]个文字', trigger: 'blur'}
        ],
        name: [
          {type: 'string', required: true, min: 1, max: 100, message: '路由名称必填, 规则：[2,100]个文字', trigger: 'blur'}
        ],
        path: [
          {type: 'string', required: true, min: 2, max: 100, message: '路由路径必须, 规则：[2,100]个文字', trigger: 'blur'}
        ],
        component: [
          {type: 'string', required: true, min: 1, max: 100, message: '视图组件名必须, 规则：[2,100]个文字', trigger: 'blur'}
        ],
        sort: [
          {type: 'number', required: true, min: 1, message: '排序值为必填选项，子级菜单的排序值必须 <= 父级菜单的排序值', trigger: 'blur'}
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
    }
  },
  methods: {
    createSend() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.CurdFormData.button_array = this.formInfo.resultArr
          create_json(this.CurdFormData).then(res => {
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
          this.CurdFormData.button_array = this.formInfo.resultArr
          //获取删除的按钮IDS
          this.CurdFormData.button_delete = this.formInfo.deleteString
          edit_json(this.CurdFormData).then(res => {
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
      let objString = JSON.stringify(this.formInfo.defaultCreate);
      this.formInfo.resultArr = JSON.parse(objString);
    },
    select_system_menu() {
      this.systemMenuTreeIsShow = true
    },
    ok_event_system_menu() {
      if (!common_func.Curd.CommonComponentSelectedCheck(this, this.$refs[`${this.refCommonSystemMenuTree}`].cur_selected_item_obj.selected === 1)) {
        return
      }
      let item = this.$refs[`${this.refCommonSystemMenuTree}`].cur_selected_item_obj
      this.CurdFormData.fid = item.id
      this.CurdFormData.ftitle = item.title
    },
    cancel_event_system_menu() {
      this.$refs[`${this.refCommonSystemMenuTree}`].cur_selected_item_obj = {}
    },
  }
}
</script>

<style scoped>


</style>
