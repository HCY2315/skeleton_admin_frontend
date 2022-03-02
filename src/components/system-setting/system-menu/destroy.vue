<template>
  <Modal
    v-model="destroy.IsShowModel"
    title="删除数据确认"
    @on-ok="destroyData(destroy.id)"
  >
    <p>确认删除吗?</p>
  </Modal>
</template>

<script>
import {destroy} from '@/api/system-setting/system_menu'
import common_func from '@/libs/common_func'

export default {
  name: "destroy",
  props: ["destroy"],
  methods: {
    destroyData(id) {
      destroy(id).then(res => {
        if (res.data.code === 200) {
          this.$emit('destroy_after')
          common_func.Curd.SuccessTips(this, res.data.msg)
        }
      }).catch(res => {
        common_func.Curd.FailTips(this, res.data.msg+res.data.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
