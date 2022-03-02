<template>
  <div :style="{height:bodyHeight}">

    <div class="toolBanner">
      <Input v-model="tableList.searchKeyWords.key_word" placeholder="关键词" style="width: 250px;margin-right: 10px"/>
      <ButtonGroup class="btnGroup">
        <Button @click="search" icon="ios-search" type="info">搜索</Button>
      </ButtonGroup>
    </div>

    <Table :style="tableList.style"
    height="500" stripe
    :ref="tableList.ref" border
    size="small"
    :highlight-row="true"
    :filterMultiple="false"
    @on-row-dblclick="dbclick()"
    :columns="tableList.cols" :data="tableList.data" @on-row-click="rowClick">
    </Table>

    <div class="pagingArea">
      <Page :total="tableList.total" :current.sync="tableList.page" :page-size="tableList.limit" ref="common_button_page"
            @on-change="pageChangeEvent" @on-page-size-change="pageSizeChangeEvent" :transfer=true show-total size="small"
            :page-size-opts="tableList.pageOptions" show-sizer/>
    </div>

  </div>
</template>

<script>
import {common_button_list} from '@/api/system-setting/common/button_cn_en'

export default {

  name: 'CommonButtonCnEn',
  created() {
    this.bodyHeight = '520px'
    this.search()
  },
  props: ['is_show'],
  watch: {
    is_show: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        if (new_value) {
          this.search()
        } else {
          this.cur_selected_item_obj = null
          this.previous_selected_item_obj.index = 0
          this.previous_selected_item_obj.item = null
        }
      }
    }
  },
  // 定义table参数
  data() {
    return {
      bodyHeight: '520px',
      cur_selected_item_obj: null,
      previous_selected_item_obj: {
        index: 0,
        item: null
      },
      selectedRows: null,
      tableList: {
        ref: 'common_button',
        // 查询相关的关键词
        searchKeyWords: {
          key_word: '',
          page: 1,
          limit: 10
        },
        // 初始化参数
        total: 0,
        page: 1,
        limit: 10,
        url: '',
        data: [],
        cols: [
          {
            title: 'id',
            key: 'id',
            width: 60
          },
          {
            title: '中文名',
            key: 'cn_name'
          },
          {
            title: '英文名',
            key: 'en_name'
          },
          {
            title: '请求方式',
            key: 'allow_method'
          },
          {
            title: '备注',
            key: 'remark'
          }
        ],
        style: {
          minHeight: '480px',
          height: '480px',
          marginBottom: '6px'
        },
        // 分页配置
        pageOptions: [5, 10, 20, 100, 200, 500]
      }

    }
  },
  methods: {
    search() {
      common_button_list(this.tableList.searchKeyWords).then(res => {
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
      this.tableList.searchKeyWords.limit = this.$refs.common_button_page.currentPageSize
      this.search()
    },
    rowClick(data, index) {
      this.cur_selected_item_obj = data
      this.selectedRows = this.$refs.common_button.getSelection()
      if (this.previous_selected_item_obj.item != null) {
        this.$refs.common_button.toggleSelect(this.previous_selected_item_obj.index)
      }
      this.$refs.common_button.toggleSelect(index)

      this.previous_selected_item_obj.item = data
      this.previous_selected_item_obj.index = index
    },
    dbclick() {
       this.$parent.$parent.$parent.buttonOk()
       this.$parent.$parent.$parent.isShowDialog = false
    }
  },
  filters: {}

}
</script>

<style scoped>
.toolBanner {
  padding: 2px 0px 6px 0px;
}
</style>
