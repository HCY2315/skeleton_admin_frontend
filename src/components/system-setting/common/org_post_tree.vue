<template>
  <Tree :ref="this.ref" :data="leftTree.syncData" :load-data="leftTree.aSyncData"
        @on-select-change="selectChange()" class="commonTreeStyle"></Tree>
</template>

<script>
import {getSubListByFid} from '@/api/system-setting/org'
import './tree_style.css'

export default {
  name: "CommonOrgTree",
  props: [
    "isShow"
  ],
  watch: {
    deep: true,
    immediate: true,
    isShow(new_value, old_value) {
      if (new_value && old_value !== undefined) {
        // 左侧树数据初始化
        getSubListByFid(0).then(res => {
          this.leftTree.syncData = res.data.data
          if (this.leftTree.syncData.length > 0) {
            this.cur_selected_item_obj.id = this.leftTree.syncData[0].id
            this.cur_selected_item_obj.title = this.leftTree.syncData[0].title
          }
        }).catch(res => {
        })
      } else {
        this.cur_selected_item_obj = {}
      }
    }
  },
  data() {
    return {
      ref: "commonOrgTree",
      cur_selected_item_obj: {
        id: -1,
        title: "",
        selected: false
      },
      // 定义左侧的树形组件参数
      leftTree: {
        syncData: [],
        aSyncData(item, callback) {
          getSubListByFid(item.id).then(res => {
            let data = res.data.data
            for (let index in data) {
              if (data[index].children == null) {
                delete data[index].children
                delete data[index].loading
              }
            }
            callback(data)
          }).catch(res => {
          })
        }
      }
    }

  },
  methods: {
    selectChange() {
      let data = this.$refs[`${this.ref}`].getSelectedNodes()
      if (data.length !== 0) {
        this.cur_selected_item_obj.id = data[0].id
        this.cur_selected_item_obj.title = data[0].title
        this.cur_selected_item_obj.selected = true
      } else {
        this.cur_selected_item_obj = {}
      }
    }
  }
}
</script>

<style scoped>

</style>
