<template>
  <div :style="{height:bodyHeight}">
    <Split v-model="divisonRatio">

      <div slot="left">
        <Tree ref="LeftTree" :data="leftTree.syncData" :load-data="leftTree.aSyncData" @on-select-change="selectChange()"></Tree>
      </div>

      <div slot="right" class="rightArea" :style="{height:bodyHeight}">

        <!-- 右侧继续划分为左、右两个区域-->
        <Split v-model="rightDivisonRatio2">
          <div slot="left" class="rightDivisonStyle">
            <!-- 已经分配给部门、岗位的系统菜单、按钮列表-->
            <div class="authTitle">已分配权限列表</div>
            <div :style="setFixHeight">
              <Tree ref="assginedSystemMenuTree" :data="rightAuthLIst.assginedSystemMenuTree" :render="renderContent" show-checkbox multiple></Tree>
            </div>
          </div>
          <div slot="right" class="rightDivisonStyle">
            <Split v-model="rightDivisonRatio">
              <div slot="left" :style="assginDestroy">
                <div v-show="buttonWarp">
                  <Button @click="assgin" icon="ios-arrow-back" type="primary" v-if="buttonList.insert">分配</Button>
                  <div style="height: 10px"></div>
                  <Button @click="destroy" icon="ios-arrow-forward" type="error" v-if="buttonList.delete">删除</Button>
                </div>
              </div>
              <!-- 待分配的系统菜单、按钮列表-->
              <div slot="right" style="padding-left: 10px">
                <div class="authTitle">待分配权限列表</div>
                <div :style="setFixHeight">
                  <Tree ref="systemMenuTree" :data="rightAuthLIst.systemMenuTree" :render="renderContent"  show-checkbox multiple></Tree>
                </div>
              </div>
            </Split>
          </div>
        </Split>

      </div>
    </Split>

  </div>
</template>
<script>

import {show_button, view_button_list} from '@/api/system-setting/user'
import {getSubListByFid} from '@/api/system-setting/postMembers'
import {AssginMenuToOrg, DelMenuAuthFromOrg, getAssginedystemMenuTree, getSystemMenuTree} from '@/api/system-setting/system_menu_assignment'
import common_func from '@/libs/common_func'

export default {
  name: 'OrgPostAuthAssignment',
  created() {
    // 页面按钮元素按照权限控制显示
    view_button_list({menu_id: this.$route.meta.menuId}).then(res => {
      show_button(res.data.data, this.buttonList)
      this.buttonWarp = true
    }).catch(res => {
    })

    // 左侧树数据初始化
    getSubListByFid(0).then(res => {
      this.leftTree.syncData = common_func.DelNullChildren(res.data.data, 1)
      if (this.leftTree.syncData.length > 0) {
        this.cur_left_item.id = this.leftTree.syncData[0].id
        this.cur_left_item.title = this.leftTree.syncData[0].title
      }
    }).catch(res => {
    })
    // 整个数据区域的高度
    this.bodyHeight = (common_func.GetBrowserHeight() - 140) + 'px'
    this.getSystemMenuLIst()
  },
  components: {},
  data() {
    return {
      common_org_tree_isshow: false,
      // 左右分割比例
      divisonRatio: 0.15,
      rightDivisonRatio: 0.15,
      rightDivisonRatio2: 0.3,
      // 数据区域默认高度 350px
      bodyHeight: '850px',
      buttonWarp: false,
      setFixHeight: {
        overflowY: "auto",
        overflowX: "hidden",
        height: (common_func.GetBrowserHeight() - 170) + 'px'
      },
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
      // 右侧已分配、带分配权限列表
      rightAuthLIst: {
        assginedSystemMenuTree: [],
        // 待分配权限列表
        systemMenuTree: []
      },
      cur_left_item: {
        id: 0,
        title: ''
      },
      buttonList: {
        insert: 'insert',
        delete: 'delete'
      }

    }
  },
  filters: {
    // statusFilter(value) {
    //   return common_func.StatusMap[value]
    // }
  },
  // 左侧选中数据改变以后同步查询条件相关的参数
  watch: {
    cur_left_item: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
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
    getSystemMenuLIst() {
      getSystemMenuTree().then(res => {
        this.rightAuthLIst.systemMenuTree = res.data.data.data
      }).catch(res => {
        this.rightAuthLIst.systemMenuTree = []
      })
    },
    // 根据部门岗位id或者已经分配的系统菜单、按钮
    getAssginedMenuList(org_post_id) {
      if (org_post_id > 0) {
        getAssginedystemMenuTree(org_post_id).then(res => {
          this.rightAuthLIst.assginedSystemMenuTree = res.data.data.data
        }).catch(res => {
          this.rightAuthLIst.assginedSystemMenuTree = []
        })
      } else {
        this.rightAuthLIst.assginedSystemMenuTree = []
      }
    },
    // 左右数据同步
    syncLeftDataToRight() {
      this.getAssginedMenuList(this.cur_left_item.id)
    },
    // 分配权限
    assgin() {
      let checkedNodes = this.$refs.systemMenuTree.getCheckedNodes()
      if (checkedNodes.length > 0) {
        // 涉及到多个接口请求，使用promise，全部请求结束做统一提示
        let finnalArray = []
        checkedNodes.every((value, index) => {
          finnalArray[index] = new Promise((resolve, reject) => {
            var sendData = {
              org_post_id: this.cur_left_item.id,
              system_menu_id: value.system_menu_id,
              system_menu_fid: value.system_menu_fid,
              button_id: value.button_id,
              node_type: value.node_type
            }
            AssginMenuToOrg(sendData).then(res => {
              resolve(true)
            }).catch(res => {
              reject(false)
            })
          })
          return true
        })
        Promise.all(finnalArray).then(finnalRes => {
          common_func.Curd.SuccessTips(this, '权限分配成功')
          this.syncLeftDataToRight()
        }).catch(res => {
          common_func.Curd.FailTips(this, '个别请求失败')
        })
      }
    },
    // 移出权限
    destroy() {
      let checkedNodes = this.$refs.assginedSystemMenuTree.getCheckedNodes()
      // 批量请求删除已分配权限
      let finnalArray = []
      checkedNodes.every((value, index) => {
        finnalArray[index] = new Promise((resolve, reject) => {
          var sendData = {
            post_mount_has_menu_id: value.post_mount_has_menu_id,
            post_mount_has_menu_button_id: value.post_mount_has_menu_button_id,
            node_type: value.node_type
          }
          DelMenuAuthFromOrg(sendData).then(res => {
            resolve(true)
          }).catch(res => {
            reject(false)
          })
        })
        return true
      })
      Promise.all(finnalArray).then(finnalRes => {
        common_func.Curd.SuccessTips(this, '权限移出成功')
        this.syncLeftDataToRight()
      }).catch(res => {
        common_func.Curd.FailTips(this, '个别请求失败')
      })
    },
    rowClick(data, index) {
      this.$refs.RightList.toggleSelect(index)
    },
    // 待分配菜单样式设置
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
      }
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

</style>
