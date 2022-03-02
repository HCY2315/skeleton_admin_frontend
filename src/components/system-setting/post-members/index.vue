<template>
  <div :style="{height:bodyHeight}">
    <Split v-model="divisonRatio">

      <div slot="left">
        <Tree ref="LeftTree" :data="leftTree.syncData" :load-data="leftTree.aSyncData" @on-select-change="selectChange()"></Tree>
      </div>

      <div slot="right" class="rightArea">

        <div class="toolBanner">
          <Input v-model="tableList.searchKeyWords.user_name" placeholder="用户名关键词" style="width: 250px"/>
          <ButtonGroup class="btnGroup" v-show="buttonWarp">
            <Button @click="search" icon="ios-search" type="info"  v-if="tableList.buttonList.select">搜索</Button>
            <Button @click="handleCreate('create')" icon="md-add" type="success"  v-if="tableList.buttonList.insert">新增</Button>
            <Button @click="handleEdit('edit')" icon="md-create" type="primary"  v-if="tableList.buttonList.update">修改</Button>
            <Button @click="handleDestory('destroy')" icon="md-close" type="error"  v-if="tableList.buttonList.delete">删除</Button>
          </ButtonGroup>
        </div>

        <Table :style="tableList.style" :height="tableList.style.height"  stripe :ref="tableList.ref" border size="small"
               :columns="tableList.cols" :data="tableList.data" @on-row-click="rowClick">
          <template slot-scope="{ row }" slot="statusName">
            {{ row.status | statusFilter }}
          </template>
        </Table>

        <div class="pagingArea">
          <Page :total="tableList.total" :current.sync="tableList.page" :page-size="tableList.limit" ref="post_members_page"
                @on-change="pageChangeEvent" @on-page-size-change="pageSizeChangeEvent" :transfer=true show-total size="small"
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
import {getSubListByFid, getMembersByOrgPostId} from '@/api/system-setting/postMembers'
import common_func from '@/libs/common_func'
import createEdit from './create_edit'
import destroy from './destroy'

export default {
  name: 'PostMembersIndex',
  created() {
    // 页面按钮元素按照权限控制显示
    view_button_list({menu_id: this.$route.meta.menuId}).then(res => {
      show_button(res.data.data, this.tableList.buttonList)
      this.buttonWarp = true
    }).catch(res => {
    })

    // 左侧树数据初始化
    getSubListByFid(0).then(res => {
      this.leftTree.syncData = common_func.DelNullChildren(res.data.data, 0)
      this.syncLeftDataToRight()
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
      // 定义左侧的树形组件参数
      leftTree: {
        syncData: [],
        aSyncData(item, callback) {
          getSubListByFid(item.id).then(res => {
            callback(common_func.DelNullChildren(res.data.data, 0))
          }).catch(res => {
          })
        }
      },
      // 定义table参数
      tableList: {
        ref: 'RightList',
        // 查询相关的关键词
        searchKeyWords: {
          org_post_id: -1,
          user_name: '',
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
        url: '',
        data: [],
        cols: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'id',
            key: 'id',
            width: 60
          },
          {
            title: '用户名',
            key: 'user_name'
          },
          {
            title: '姓名',
            key: 'real_name'
          },
          {
            title: '状态',
            key: 'status',
            slot: 'statusName'
          },
          {
            title: '岗位名称',
            key: 'post_name'
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
          height: (common_func.GetBrowserHeight() - 200),
          marginBottom: '6px'
        },
        // 分页配置
        pageOptions: [5, 20, 50, 100, 200, 500]
      },
      cur_left_item: {
        id: 0,
        title: ''
      },
      // 新增、更新 表单的界面显示数据
      CurdLayerData: {
        isShow: false,
        action: '', // inser 、Edit
        title: ''// 新增 、修改
      },
      CurdFormData: {
        org_post_id: -1,
        post_name: '',
        id: -1,
        user_id: -1,
        user_name: '',
        real_name: '',
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
    }
  },
  // 左侧选中数据改变以后同步查询条件相关的参数
  watch: {
    cur_left_item: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        this.tableList.searchKeyWords.org_post_id = new_value.id
        this.CurdFormData.org_post_id = new_value.id
        this.CurdFormData.post_name = new_value.title
        // 同步左右数据
        this.syncLeftDataToRight()
      }
    }
  },
  methods: {
    selectChange() {
      let data = this.$refs.LeftTree.getSelectedNodes()
      if (data.length > 0) {
        this.cur_left_item.id = data[0].id
        this.cur_left_item.title = data[0].title
      } else {
        this.cur_left_item.id = 0
        this.cur_left_item.title = ''
      }
    },
    // 数据搜索，主要筛选右侧的数据
    search() {
      getMembersByOrgPostId(this.tableList.searchKeyWords).then(res => {
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
      this.tableList.searchKeyWords.limit = this.$refs.post_members_page.currentPageSize

      getMembersByOrgPostId(this.tableList.searchKeyWords).then(res => {
        this.tableList.data = res.data.data.data
        this.tableList.total = res.data.data.count
      }).catch(res => {
        this.tableList.data = []
        this.tableList.total = 0
      })
    },
    // 左右数据同步
    syncLeftDataToRight() {
      getMembersByOrgPostId(this.tableList.searchKeyWords).then(res => {
        this.tableList.data = res.data.data.data
        this.tableList.total = res.data.data.count
      }).catch(res => {
        this.tableList.total = 0
        this.tableList.data = []
      })
    },
    // 新增
    handleCreate(action) {
      // 检查是否允许新增
      if (!common_func.Curd.CreateCheck(this, this.cur_left_item.id >= 0)) {
        return
      }
      this.setFormData(action)
      // 弹出新增界面
      this.CurdLayerData.isShow = true
      this.CurdLayerData.action = action
      this.CurdLayerData.title = common_func.CurdWay[action]
    },
    // 修改
    handleEdit(action) {
      let selectedRows = this.$refs.RightList.getSelection()
      if (!common_func.Curd.EditCheck(this, selectedRows.length === 1)) {
        return
      }
      this.setFormData(action, selectedRows[0])
      // 弹出修改界面
      this.CurdLayerData.isShow = true
      this.CurdLayerData.action = action
      this.CurdLayerData.title = common_func.CurdWay[action]
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

    // 参数：
    // curdCode ： create、edit
    // curSelectedItem 当前选中行对象，修改数据使用，新增忽略即可
    setFormData(curdCode, curSelectedItem) {
      if (curdCode === 'create') {
        this.CurdFormData.org_post_id = this.cur_left_item.id
        this.CurdFormData.org_post_name = this.cur_left_item.title
        this.CurdFormData.user_id = -1
        this.CurdFormData.user_name = ''
        this.CurdFormData.real_name = ''
        this.CurdFormData.status = 1
        this.CurdFormData.remark = ''
        delete this.CurdFormData['id']
      } else if (curdCode === 'edit') {
        this.CurdFormData.org_post_id = curSelectedItem.org_post_id
        this.CurdFormData.post_name = curSelectedItem.post_name
        this.CurdFormData.id = curSelectedItem.id
        this.CurdFormData.user_id = curSelectedItem.user_id
        this.CurdFormData.user_name = curSelectedItem.user_name
        this.CurdFormData.real_name = curSelectedItem.real_name
        this.CurdFormData.status = curSelectedItem.status
        this.CurdFormData.remark = curSelectedItem.remark
      }
    },
    rowClick(data, index) {
      this.$refs.RightList.toggleSelect(index)
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
