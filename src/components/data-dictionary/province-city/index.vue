<template>
  <div :style="{height:bodyHeight}">
    <Split v-model="divisonRatio">

      <div slot="left">
        <div :style="setFixHeight">
          <Tree ref="LeftTree" :data="leftTree.syncData" :load-data="leftTree.aSyncData" @on-select-change="selectChange()"></Tree>
        </div>
      </div>

      <div slot="right" class="rightArea">

        <div class="toolBanner">
          <Input v-model="tableList.searchKeyWords.name" placeholder="省份城市名称" style="width: 250px"/>
          <ButtonGroup class="btnGroup" v-show="buttonWarp">
            <Button @click="search" icon="ios-search" type="info" v-if="tableList.buttonList.select">搜索</Button>
            <Button @click="handleCreate('create')" icon="md-add" type="success" v-if="tableList.buttonList.insert">新增</Button>
            <Button @click="handleEdit('edit')" icon="md-create" type="primary" v-if="tableList.buttonList.update">修改</Button>
            <Button @click="handleDestory('destroy')" icon="md-close" type="error" v-if="tableList.buttonList.delete">删除</Button>
          </ButtonGroup>
        </div>

        <Table :style="tableList.style" :height="tableList.style.height" stripe :ref="tableList.ref" border size="small"
               :columns="tableList.cols" :data="tableList.data" @on-row-click="rowClick">
          <template slot-scope="{ row }" slot="statusName">
            {{ row.status | statusFilter }}
          </template>
        </Table>

        <div class="pagingArea">
          <Page :total="tableList.total" :current.sync="tableList.page" :page-size="tableList.limit" ref="citylist_page"
                @on-change="pageChangeEvent" @on-page-size-change="pageChangeEvent" :transfer=true show-total size="small"
                :page-size-opts="tableList.pageOptions" show-sizer/>
        </div>

      </div>
    </Split>

    <!-- CURD 界面-->
    <createEdit :CurdFormData="CurdFormData" :CurdLayerData="CurdLayerData" v-on:create_edit_after="create_edit_after_callback"></createEdit>
    <destroy :destory="destory" v-on:destroy_after="destroy_after_callback"></destroy>

  </div>
</template>
<script>
import {show_button, view_button_list} from '@/api/system-setting/user'
import {getSubListByFid, list} from '@/api/data-dictionary/province_city'
import common_func from '@/libs/common_func'
import createEdit from './create_edit'
import destroy from './destroy'

export default {
  name: 'ProvinceCity',
  created() {
    // 页面按钮元素按照权限控制显示
    view_button_list({menu_id: this.$route.meta.menuId}).then(res => {
      show_button(res.data.data, this.tableList.buttonList)
      this.buttonWarp = true

    }).catch(res => {
    })
    // 左侧树数据初始化
    getSubListByFid(0).then(res => {
      this.leftTree.syncData = common_func.DelNullChildren(res.data.data, 1)
      if (this.leftTree.syncData.length > 0) {
        this.cur_left_item.id = this.leftTree.syncData[0].id
        this.cur_left_item.name = this.leftTree.syncData[0].title
      }
    }).catch(res => {
    })
    // 整个数据区域的高度
    this.bodyHeight = (common_func.GetBrowserHeight() - 140) + 'px'

  },
  components: {
    createEdit,
    destroy
  },
  data() {
    return {
      // 左右分割比例
      divisonRatio: 0.15,
      // 数据区域默认高度 350px
      bodyHeight: '850px',
      buttonWarp: false,
      setFixHeight: {
        overflowY: "auto",
        overflowX: "hidden",
        height: (common_func.GetBrowserHeight() - 150) + 'px'
      },
      // 定义左侧的树形组件参数
      leftTree: {
        syncData: [],
        aSyncData(item, callback) {
          getSubListByFid(item.id).then(res => {
            callback(common_func.DelNullChildren(res.data.data, 0))
          }).catch(res => {
            item.loading = false
            item.children = null
          })
        }
      },
      // 定义table参数
      tableList: {
        ref: "RightList",
        // 查询相关的关键词
        searchKeyWords: {
          fid: 0,
          name: '',
          page: 1,
          limit: 20
        },
        buttonList: {
          insert: 'insert',
          delete: 'delete',
          update: 'update',
          select: 'select',
        },
        total: 0,
        page: 1,
        limit: 20,
        url: "",
        data: [],
        cols: [
          {
            type: 'selection',
            width: 60,
            resizable: true,
            align: 'center'
          },
          {
            title: 'id',
            key: 'id',
            resizable: true,
            width: 100
          },
          {
            title: '省份城市名称',
            resizable: true,
            width: 120,
            key: 'name'
          },
          {
            title: '数据状态',
            key: 'status',
            resizable: true,
            slot: 'statusName',
            width: 120
          },
          {
            title: '节点深度',
            resizable: true,
            key: 'node_level',
            width: 120
          },
          {
            title: '排序',
            resizable: true,
            key: 'sort',
            width: 100
          },
          {
            title: '备注',
            resizable: true,
            key: 'remark',
            width: 160
          },
          {
            title: '添加时间',
            resizable: true,
            key: 'created_at'
          },
          {
            title: '更新时间',
            resizable: true,
            key: 'updated_at'
          }
        ],
        style: {
          height: (common_func.GetBrowserHeight() - 200),
          marginBottom: '6px'
        },
        //分页配置
        pageOptions: [5, 20, 50, 100, 200, 500],
      },
      cur_left_item: {
        id: 0,
        name: ""
      },
      //新增、更新 表单的界面显示数据
      CurdLayerData: {
        isShow: false,
        action: "", // inser 、Edit
        name: ""// 新增 、修改
      },
      CurdFormData: {
        ftitle:'',
        fid: -1,
        name: '',
        id: -1,
        sort: 0,
        status: 1,
        remark: ''
      },

      // 删除操作
      destory: {
        IsShowModel: false,
        id: -1
      }

    }
  },
  filters: {
    statusFilter(value) {
      return common_func.StatusMap[value]
    },
  },
  // 左侧选中数据改变以后同步查询条件相关的参数
  watch: {
    cur_left_item: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        this.tableList.searchKeyWords.fid = new_value.id
        this.syncLeftDataToRight()
      }
    }
  },
  methods: {
    selectChange() {
      let data = this.$refs.LeftTree.getSelectedNodes()
      if (data && data.length > 0) {
        this.cur_left_item.id = data[0].id
        this.cur_left_item.name = data[0].title
      } else {
        this.cur_left_item.id = -1
        this.cur_left_item.name = ""
      }
    },
    // 数据搜索，主要筛选右侧的数据
    search() {
      list(this.tableList.searchKeyWords).then(res => {
        this.tableList.data = res.data.data.data
        this.tableList.total = res.data.data.count
      }).catch(res => {
        this.tableList.data = []
        this.tableList.total = 0
      })
    },
    //分页选项改变事件
    pageSizeChangeEvent() {
      if (this.tableList.page !== 1) return
      this.pageChangeEvent()
    },
    // 页码改变事件
    pageChangeEvent() {
      this.tableList.searchKeyWords.page = this.tableList.page
      this.tableList.searchKeyWords.limit = this.$refs.citylist_page.currentPageSize

      list(this.tableList.searchKeyWords).then(res => {
        this.tableList.data = res.data.data.data
        this.tableList.total = res.data.data.count
      }).catch(res => {
        this.tableList.data = []
        this.tableList.total = 0
      })
    },
    // 左右数据同步
    syncLeftDataToRight() {
      list(this.tableList.searchKeyWords).then(res => {
        this.tableList.data = res.data.data.data
        this.tableList.total = res.data.data.count
      }).catch(res => {
        this.tableList.data = []
        this.tableList.total = 0
      })
    },
    //新增
    handleCreate(action) {
      // 检查是否允许新增
      if (!common_func.Curd.CreateCheck(this, this.cur_left_item.id >= 0)) {
        return
      }
      this.setFormData(action)
      // 弹出新增界面
      this.CurdLayerData.action = action
      this.CurdLayerData.name = common_func.CurdWay[action]
      this.CurdLayerData.isShow = true
    },
    handleEdit(action) {
      let selectedRows = this.$refs.RightList.getSelection()
      if (!common_func.Curd.EditCheck(this, selectedRows.length === 1)) {
        return
      }
      this.setFormData(action, selectedRows[0])
      // 弹出修改界面
      this.CurdLayerData.isShow = true
      this.CurdLayerData.action = action
      this.CurdLayerData.name = common_func.CurdWay[action]
    },
    // 删除
    handleDestory() {
      let selectedRows = this.$refs.RightList.getSelection()
      if (!common_func.Curd.DestroyCheckForOneItem(this, selectedRows.length === 1)) {
        return
      }
      this.destory.id = selectedRows[0].id
      this.destory.IsShowModel = true
    },
    // 删除数据之后，刷新数据主界面
    destroy_after_callback() {
      this.search()
    },

    //参数：
    //curdCode ： create、edit
    //curSelectedItem 当前选中行对象，修改数据使用，新增忽略即可
    setFormData(curdCode, curSelectedItem) {
      // 公共参数
      this.CurdFormData.fid=this.cur_left_item.id
      this.CurdFormData.ftitle=this.cur_left_item.name

      if (curdCode === "create") {
        this.CurdFormData.name = ''
        this.CurdFormData.status = 1
        this.CurdFormData.sort = 0
        this.CurdFormData.remark = ''
        delete this.CurdFormData['id']

      } else if (curdCode === "edit") {
        this.CurdFormData.id = curSelectedItem.id
        this.CurdFormData.name = curSelectedItem.name
        this.CurdFormData.status = curSelectedItem.status
        this.CurdFormData.sort = curSelectedItem.sort
        this.CurdFormData.remark = curSelectedItem.remark
      }
    },
    rowClick(data, index) {
      this.$refs.RightList.toggleSelect(index);
    },
    // 新增、修改数据结束后的回调函数，刷新主界面数据
    create_edit_after_callback() {
      this.syncLeftDataToRight(this.cur_left_item.id)
    }
  }
}
</script>

<style scoped>
.rightArea {
  padding-left: 4px;
}

.toolBanner {
  padding: 2px 0 6px 10px;
}

.btnGroup {
  padding: 0 10px;
}

.pagingArea {
  text-align: center;
}

</style>

