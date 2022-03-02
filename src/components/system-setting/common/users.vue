<template>
  <div :style="{height:bodyHeight}">

    <div class="toolBanner">
      <Input v-model="tableList.searchKeyWords.user_name" placeholder="用户关键词" style="width: 250px;margin-right: 10px"/>
      <ButtonGroup class="btnGroup">
        <Button @click="search" icon="ios-search" type="info">搜索</Button>
      </ButtonGroup>
    </div>

    <Table :style="tableList.style" stripe :ref="tableList.ref" border size="small" :highlight-row="true" :filterMultiple="false"
           :columns="tableList.cols" :data="tableList.data"
           @on-row-click="rowClick"  @on-select-cancel="rowPreCheckboxCancelChecked" @on-select="rowPreCheckboxChecked">
      <template slot-scope="{ row }" slot="statusName">
        {{ row.status | statusFilter }}
      </template>

    </Table>

    <div class="pagingArea">
      <Page :total="tableList.total" :current.sync="tableList.page" :page-size="tableList.limit" :ref="tableList.pageRef"
            @on-change="pageChangeEvent" @on-page-size-change="pageSizeChangeEvent" :transfer=true show-total size="small"
            :page-size-opts="tableList.pageOptions" show-sizer/>
    </div>

  </div>
</template>

<script>
import {common_user_list} from '@/api/system-setting/common/user'
import common_func from '@/libs/common_func'

export default {

  name: 'CommonUsers',
  created() {
    this.bodyHeight = '520px'
  },
  // isShow=true 显示组件，false 隐藏组件
  // selectPattern 表示公共组件的选择模式，one=单条选择；more=多条选择
  props: ['isShow', 'selectPattern'],
  watch: {
    isShow: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        if (new_value) {
          // 多选模式弹出选择框
          if (this.selectPattern === 'more' && old_value !== undefined) {
            this.tableList.cols = this.tableList.cols_checkbox.concat(this.tableList.cols)
          }
          this.search()
        } else {
          if (this.selectPattern === 'more' && old_value !== undefined) {
            this.tableList.cols.splice(0, 1)
          }
          this.cur_selected_item_obj = {}
        }
      }
    }
  },
  // 定义table参数
  data() {
    return {
      bodyHeight: '520px',
      cur_selected_item_obj: {},
      selectedRows: [],
      tableList: {
        ref: 'commonUser',
        pageRef: 'commonUserPage',
        // 查询相关的关键词
        searchKeyWords: {
          user_name: '',
          page: 1,
          limit: 20
        },
        // 初始化参数
        total: 0,
        page: 1,
        limit: 20,
        url: '',
        data: [],
        cols_checkbox: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }
        ],
        cols: [
          {
            title: 'id',
            key: 'id',
            width: 60
          },
          {
            title: '用户名',
            key: 'user_name',
            width: 80
          },
          {
            title: '姓名',
            key: 'real_name',
            width: 80
          },
          {
            title: '手机',
            key: 'phone',
            width: 80
          },
          {
            title: '隶属部门',
            key: 'org_name',
            width: 120
          },
          {
            title: '状态',
            key: 'status',
            slot: 'statusName'
          },
          {
            title: '登陆ip',
            key: 'last_login_ip'
          },
          {
            title: '备注',
            key: 'remark'
          },
          {
            title: '创建时间',
            key: 'created_at',
            width: 150
          },
          {
            title: '更新时间',
            key: 'updated_at',
            width: 150
          }
        ],
        style: {
          minHeight: '480px',
          height: '480px',
          marginBottom: '6px'
        },
        // 分页配置
        pageOptions: [5, 20, 50, 100, 200, 500]
      }

    }
  },
  methods: {
    search() {
      common_user_list(this.tableList.searchKeyWords).then(res => {
        this.tableList.data = res.data.data.data
        this.tableList.total = res.data.data.count
      }).catch(res => {
        this.tableList.data = []
        this.tableList.total = 0
      })
    },
    // 分页选项改变事件
    pageSizeChangeEvent() {
      if (this.tableList.page !== 1) return
      this.pageChangeEvent()
    },
    // 页码改变事件
    pageChangeEvent() {
      this.tableList.searchKeyWords.page = this.tableList.page
      this.tableList.searchKeyWords.limit = this.$refs[`${this.tableList.pageRef}`].currentPageSize
      this.search()
    },
    // 行点击事件,负责点击行时同步选中前面的checkbox
    rowClick(data, index) {
      //多选模式(more),
      if (this.selectPattern === "more") {
        this.$refs[`${this.tableList.ref}`].toggleSelect(index)
      } else {
        // 单选模式（首先全部取消，然后选中当前行即可）
        this.$refs[`${this.tableList.ref}`].selectAll(false)
        this.$refs[`${this.tableList.ref}`].toggleSelect(index)
        this.selectedRows[0] = data
      }
      this.cur_selected_item_obj = data
    },
    // 行前面的 checkbox 选中事件
    rowPreCheckboxChecked(selection, row) {
      if (this.selectPattern === "more") {
        this.selectedRows = this.$refs[`${this.tableList.ref}`].getSelection()
      } else {
        this.selectedRows[0] = row
      }
      this.cur_selected_item_obj = row
    },
    // 行前面的 checkbox 取消选中事件，只有多行模式前面有checkbox，所以这里只需要处理多行模式逻辑即可
    rowPreCheckboxCancelChecked(selection, row) {
      if (this.selectPattern === "more") {
        this.selectedRows = this.$refs[`${this.tableList.ref}`].getSelection()
      }
    },
  },
  filters: {
    statusFilter(value) {
      return common_func.StatusMap[value]
    }
  }

}
</script>

<style scoped>
.toolBanner {
  padding: 2px 0 6px 0;
}
</style>
