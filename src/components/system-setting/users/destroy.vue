<template>
  <Modal
    v-model="destory.IsShowModel"
    title="删除数据确认"
    @on-ok="destoryData(destory.id)"
  >
    <p>确认删除吗?</p>
  </Modal>
</template>

<script>
import {destory} from '@/api/system-setting/user'
import common_func from '@/libs/common_func'

export default {
  name: 'destroy',
  props: ['destory'],
  methods: {
    destoryData(id) {
      destory(id).then(res => {
        if (res.status === 200) {
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
