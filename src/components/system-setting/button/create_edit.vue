<template>
  <div>
    <!--    新增、修改 弹出界面-->
    <Drawer
      :title="CurdLayerData.title" v-model="CurdLayerData.isShow" :mask-closable=false :closable=true
      :draggable=true @on-close="drawer_close()" :style="drawerLayerStyle" :width="drawerLayerStyle.width">
      <Form ref="formValidate" :model="CurdFormData" :rules="ruleValidate" label-position="left" :label-width="110">

        <Row :gutter="32">
          <Col span="12">
            <FormItem label="按钮名称：" prop="cn_name">
              <Input v-model="CurdFormData.cn_name" placeholder="按钮名称">
              </Input>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="英文名称：" prop="en_name">
              <Input v-model="CurdFormData.en_name" placeholder="英文名称"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">

          <Col span="10">
            <FormItem label="按钮颜色：" prop="color">
              <Input v-model="CurdFormData.color" placeholder="按钮颜色">
              </Input>
            </FormItem>
          </Col>
          <Col span="2">
            <ColorPicker v-model="CurdFormData.color"/>
          </Col>

          <Col span="12">
            <FormItem label="允许方法：" prop="allow_method">
              <Input v-model="CurdFormData.allow_method" placeholder="允许方法"/>
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
        <Button type="primary" @click="CurdLayerData.action==='create'?createSend():editSend()">{{CurdLayerData.title}}
        </Button>
      </div>
    </Drawer>

  </div>

</template>

<script>
import {create, edit} from '@/api/system-setting/button'
import common_func from '@/libs/common_func'
import CommonOrgPostTree from '_c/system-setting/common/org_post_tree'

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
    CommonOrgPostTree
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
        en_name: [
          {type: 'string', required: true, min: 2, max: 40, message: '按钮英文名为必填项, 规则：[2,40]', trigger: 'blur'}
        ],
        cn_name: [
          {type: 'string', required: true, min: 2, max: 40, message: '按钮名称为必填项, 规则：[2,40]', trigger: 'blur'}
        ],
        color: [
          {type: 'string', required: true, message: '颜色必填选项，请选择颜色', trigger: 'blur'}
        ],
        allow_method: [
          {type: 'string', required: true, message: '请求方式必填', trigger: 'blur'}
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
      commonOrgTree: {
        is_show: false,
        ref: 'commonOrgTree'
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
    }
  }
}
</script>

<style scoped>

</style>
