<template>
  <div :style="{height:bodyHeight}">
    <Split v-model="divisonRatio">
      <div slot="left">
        用户名:<Input v-model="tableList.searchKeyWords.real_name" placeholder="关键词..." class="keyWordsInput"/>
        <ButtonGroup class="btnGroup" v-show="buttonWarp">
          <Button @click="search" icon="ios-search" type="info" v-if="tableList.buttonList.select">搜索</Button>
        </ButtonGroup>
        <div style="display:block;height:6px"></div>
        <Table @on-row-click="rowClick" highlight-row ref="currentRowTable" :columns="tableList.cols" :data="tableList.data"></Table>
        <div class="pageStyle">
          <Page :total="tableList.total" :current.sync="tableList.page" :page-size="tableList.limit" ref="post_members_page"
                @on-change="pageChangeEvent" @on-page-size-change="pageSizeChangeEvent" :transfer=true show-total size="small"
                :page-size-opts="tableList.pageOptions" show-sizer/>
        </div>
      </div>

      <div slot="right" class="rightArea" :style="{height:bodyHeight}">
        <div slot="left" class="rightDivisonStyle">
          <!-- 已经分配给部门、岗位的系统菜单、按钮列表-->
          <div class="authTitle">已分配的权限</div>
          <div :style="setFixHeight">
            <Tree ref="assginedSystemMenuTree" :data="treeData" :render="renderContent" :expand-node="true" multiple>
            </Tree>
          </div>
        </div>
      </div>
    </Split>
  </div>
</template>
<script>

import {has_auth_list, show_button, user_list_with_post, view_button_list} from '@/api/system-setting/user'
import common_func from '@/libs/common_func'

export default {
  name: 'OrgPostAuthAnalysis',
  created() {
    // 页面按钮元素按照权限控制显示
    view_button_list({menu_id: this.$route.meta.menuId}).then(res => {
      show_button(res.data.data, this.tableList.buttonList)
      this.buttonWarp = true
      // 左侧树数据初始化
      this.search()

    }).catch(res => {
    })

    // 整个数据区域的高度
    this.bodyHeight = (common_func.GetBrowserHeight() - 140) + 'px'
  },
  components: {},
  data() {
    return {
      // 左右分割比例
      divisonRatio: 0.25,
      rightDivisonRatio: 0.75,
      // 数据区域默认高度 350px
      bodyHeight: '850px',
      buttonWarp: false,
      setFixHeight: {
        overflowY: "auto",
        overflowX: "hidden",
        height: (common_func.GetBrowserHeight() - 170) + 'px'
      },
      // 右侧已分配、带分配权限列表
      treeData: [],
      tableList: {
        buttonList: {
          select: 'select'
        },
        cols: [
          {
            title: 'ID',
            key: 'id',
            width: 60
          },
          {
            title: '姓名',
            key: 'real_name',
            render: (h, params) => {
              return h('div', [
                h('ListItemMeta', {
                  props: {
                    title: params.row.real_name,
                    description: params.row.post_name
                  }
                }),

              ])
            }
          }
        ],
        data: [],
        searchKeyWords: {
          real_name: '',
          page: 1,
          limit: 20
        },
        total: 0,
        page: 1,
        limit: 20,
        pageOptions: [5, 20, 50, 100, 200, 500]
      },
      common_org_tree_isshow: false
    }
  },
  methods: {
    renderContent(h, {root, node, data}) {
      if (data.node_type === "menu") {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'md-menu',
                size: 16,
              },
              style: {
                marginRight: '8px',
                color: 'orange'
              }
            }),
            h('span', data.title)
          ])
        ]);
      } else if (data.node_type === "button") {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'md-radio-button-on',
                size: 16,
              },
              style: {
                marginRight: '8px',
                color: 'green'
              }
            }),
            h('span', data.title)
          ])
        ]);
      } else {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-folder-open',
                size: 16,
              },
              style: {
                marginRight: '8px',
                color: 'orange'
              }
            }),
            h('span', data.title)
          ])
        ]);
      }
    },
    search() {
      user_list_with_post(this.tableList.searchKeyWords).then(res => {
        (res.data.data.data[0])._highlight = true // 首行默认高亮(选中状态)
        this.tableList.data = res.data.data.data
        this.tableList.total = res.data.data.count
        if (this.tableList.total > 0) {
          has_auth_list(this.tableList.data[0].id).then(res => {
            this.treeData = res.data.data
          }).catch(res => {
            this.treeData = []
          })
        }
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
      this.search()
    },
    // 分配权限
    rowClick(data, index) {
      has_auth_list(data.id).then(res => {
        this.treeData = res.data.data
      }).catch(res => {
        this.treeData = []
      })
    }
  },
  computed: {
    assginDestroy() {
      return {
        textAlign: 'center',
        marginTop: parseInt(common_func.GetBrowserHeight() / 2 - 100) + 'px'

      }
    }
  }
}

</script>
<style scoped>
.rightArea {
  padding-left: 4px;
}

.rightDivisonStyle {
  padding-left: 10px;
  height: 100%;
}

.authTitle {
  width: calc(100% - 20px);
  border-bottom: 1px solid lightgray;
}

.keyWordsInput {
  width: 260px;
  margin: 0 4px
}

.pageStyle {
  width: calc(20%);
  display: inline;
  text-align: center;
  position: fixed;
  bottom: 6px;
}
</style>
