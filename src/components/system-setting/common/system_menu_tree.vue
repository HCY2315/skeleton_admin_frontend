<template>
  <Tree :ref="this.ref" :data="leftTree.syncData" :load-data="leftTree.aSyncData"
        class="commonTreeStyle"  @on-select-change="selectChange()"></Tree>

</template>

<script>
import {getSubListByFid} from '@/api/system-setting/system_menu'
import './tree_style.css'
export default {
  name: "CommonSystemMenuTree",
  props: [
    "isShow"
  ],
  watch: {
    deep: true,
    immediate: true,
    isShow(new_value, old_value) {
      if (new_value) {
        // 左侧树数据初始化
        getSubListByFid(0).then(res => {
          this.leftTree.syncData = res.data.data
          if (this.leftTree.syncData.length > 0) {
            this.cur_selected_item_obj.id = this.leftTree.syncData[0].id
            this.cur_selected_item_obj.title = this.leftTree.syncData[0].title
          }
        }).catch(res => {
        })
      }
    }
  },
  data() {
    return {
      ref: "CommonSystemMenuTree",
      cur_selected_item_obj: {
        id: -1,
        title: "",
        selected: 0
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
        this.cur_selected_item_obj.selected = 1
      } else {
        this.cur_selected_item_obj.id = -1
        this.cur_selected_item_obj.title = ""
        this.cur_selected_item_obj.selected = 0
      }
    }
  }
}
</script>

<style scoped>
/*.commonTreeStyle{*/
/*  width: 520px;*/
/*  height: 600px;*/
/*  overflow-y:auto;*/
/*}*/
</style>
