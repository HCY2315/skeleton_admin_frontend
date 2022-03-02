<template>
  <div>
    <Card :bordered="true" style="border-width:2px" :dis-hover="true">
      <div style="display: block;border-bottom: lightgray 1px solid;padding:4px 4px;margin-bottom: 10px">
        <Button @click="handleCreate()" size="small" icon="md-add" type="success">添加</Button>
      </div>

      <!-- 表单的title -->
      <Row style="margin-left:2px;background: #DDE5E5FF;border-radius: 2px;line-height: 24px;vertical-align: middle;">
        <Col v-for="(item, i) in formInfo.tableCols" :key="i" :span="item.hasOwnProperty('width')?item.width:5">
          <span v-show="item.hasOwnProperty('isShow')?item.isShow:true"><span
            style="color:red;padding-right: 2px">*</span>{{ item.name }}</span>
        </Col>
      </Row>
      <!--对话框,弹出按钮选择界面-->
      <Modal
        title="选择"
        v-model="isShowDialog"
        class-name="vertical-center-modal"
        :width="modalWidth"
        @on-ok="buttonOk"
      >
        <component :is_show="is_show" :is="apps" ref="compsRef"></component>
      </Modal>
      <div v-for="(item, i) in formInfo.resultArr" :key="i" style="width:100%;">
        <!-- <FormItem label="视图组件："  prop="component"> -->
        <Row align="middle">
          <Col style="padding-right:5px" v-for="(value, key) in formInfo.tableCols" :key="key"
               :span="(value.hasOwnProperty('width') && value.type !== 'upload') ? value.width:5">
            <FormItem v-if="value.type === 'dialog'" v-show="value.hasOwnProperty('isShow')?item.isShow:true"
                      :label-width="0">
              <Input v-if="value.disabled === true" icon="ios-search" disabled
                     v-model="formInfo.resultArr[i][value.field]" size="small" placeholder=""/>
              <Input v-if="value.disabled !== true" icon="ios-search" disabled @on-click="searchDialog(i,key)"
                     v-model="formInfo.resultArr[i][value.field]" size="small" placeholder=""/>
            </FormItem>
            <FormItem v-if="value.type === 'string'" v-show="value.hasOwnProperty('isShow')?item.isShow:true"
                      :label-width="0">
              <Input v-model="formInfo.resultArr[i][value.field]" size="small" :disabled="value.disabled"
                     placeholder=""/>
            </FormItem>
            <FormItem v-if="value.type === 'number'" v-show="value.hasOwnProperty('isShow')?item.isShow:true"
                      :label-width="0">
              <Input v-model.number="formInfo.resultArr[i][value.field]" size="small" :disabled="value.disabled"
                     placeholder=""/>
            </FormItem>
            <FormItem v-if="value.type === 'selectString'" v-show="value.hasOwnProperty('isShow')?item.isShow:true"
                      :label-width="0">
              <Select v-model="formInfo.resultArr[i][value.field]" :disabled="value.disabled" size="small"
                      placeholder="">
                <Option v-for="(option, optionKey) in value.option" :key="optionKey" :value="option">{{ option }}
                </Option>
              </Select>
            </FormItem>
            <FormItem v-if="value.type === 'selectNumber'" v-show="value.hasOwnProperty('isShow')?item.isShow:true"
                      :label-width="0">
              <Select v-model.number="formInfo.resultArr[i][value.field]" size="small" :disabled="value.disabled"
                      placeholder="">
                <Option v-for="(option, optionKey) in value.option" :key="optionKey" :value="parseInt(optionKey)">
                  {{ option }}
                </Option>
              </Select>
            </FormItem>
            <FormItem v-if="value.type === 'upload'" v-show="value.hasOwnProperty('isShow')?item.isShow:true"
                      :label-width="0">
              <Input :style="'display:block;float:left;width:87%;margin-top:5px'"
                     v-model="formInfo.resultArr[i][value.field]" size="small" placeholder=""/>
              <Upload v-if="value.disabled !== true" style="display:block;float:left;width:13%"
                      :show-upload-list="false"
                      :headers="headers"
                      :on-success="handleSuccess"
                      :action="uploadPath">
                <Button @click="uploadClick(i,value.field)" size="small" icon="ios-cloud-upload-outline"></Button>
              </Upload>
            </FormItem>
          </Col>
          <Col span="1">
            <Button size="small" style="margin-top:5px" @click="handleDelete(i)">
              <Icon size="6" type="ios-close-circle"/>
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>
<script>
import common_func from '@/libs/common_func'
import {getToken} from '@/libs/util'
import config from '@/config'

export default {
  name: 'ChildrenTable',
  props: {
    formInfo: Object
  },
  data() {
    return {
      comps: '',
      apps: null,
      isShowDialog: false,
      flag: null,
      DeleteArr: [],
      dialogMap: {},
      baseUrl: '',
      uploadFlag: null,
      uploadField: '',
      is_show: 0,
      uploadPath: '',
      modalWidth: '900px',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
    }
  },
  created() {
    this.uploadPath = common_func.GetAdminPath() + '/' + config.uploadPath
    let objString = JSON.stringify(this.formInfo.defaultCreate);
    this.formInfo.resultArr = JSON.parse(objString);
  },
  methods: {
    handleCreate() {
      let data = {}
      Object.assign(data, this.formInfo.formDataItem)
      this.formInfo.resultArr.push(data)
    },
    handleDelete(i) {
      //如果是修改菜单,则需要把删除的ID记录,传入后台
      let deleteId = this.formInfo.resultArr[i].id
      if (deleteId !== 0) {
        this.DeleteArr.push(deleteId)
      }
      this.formInfo.resultArr.splice(i, 1)
      this.formInfo.deleteString = this.DeleteArr.toString()
    },
    searchDialog(i, key) {
      this.isShowDialog = true
      this.comps = this.formInfo.tableCols[key].componentPath
      //编辑宽度
      if (this.formInfo.tableCols[key].hasOwnProperty('modalWidth')) {
        this.modalWidth = this.formInfo.tableCols[key].modalWidth
      }
      let str = this.comps.substr(0, 2)
      let path_c = this.comps.substr(3)
      let path_a = this.comps.substr(2)
      if (str === '_c') {
        this.apps = require(`_c/${path_c}.vue`).default
      } else if (str === '@/') {
        this.apps = require(`@/${path_a}.vue`).default
      }
      this.flag = i
      this.$nextTick(function () {
        this.is_show = 1
      })

      this.dialogMap = this.formInfo.tableCols[key].map
    },
    handleSuccess(res, file) {
      this.formInfo.resultArr[this.uploadFlag][this.uploadField] = file.response.data.path
    },
    buttonOk() {
      for (let k in this.dialogMap) {
        this.formInfo.resultArr[this.flag][k] = this.$refs.compsRef.cur_selected_item_obj[this.dialogMap[k]]
      }
      this.flag = null
    },
    uploadClick(i, field) {
      this.uploadFlag = i
      this.uploadField = field
    }
  }
}
</script>
<style scoped>
div.ivu-form-item {
  vertical-align: top;
  zoom: 1;
  margin-bottom: 10px;
}
</style>
