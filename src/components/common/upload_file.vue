<template>
  <Upload src="" :show-upload-list="false" :headers="headers" :on-success="handleSuccess" :action="baseUrl+'/upload/files'">
    <Button icon="ios-cloud-upload-outline">点击上传</Button>
  </Upload>
</template>

<script>
import {getToken} from '@/libs/util'
import common_func from '@/libs/common_func'

export default {
  name: 'UploadFile',
  props: {
    src: String,
    savePath: String,
  },
  // 注意：新增界面的初始化函数在父页面初始化时会调用，并不是在显示的时候调用
  created() {
    this.baseUrl = common_func.GetAdminPath()
    this.picUrl = common_func.GetPublicPath()
  },
  mounted() {
  },
  watch: {
    savePath: {
      deep: true,
      immediate: true,
      handler(new_value, old_value) {
        if (this.new_value !== "") {
          this.$emit('update:src', this.picUrl + this.savePath)
        } else {
          this.$emit('update:src', "")
        }
      }
    }
  },
  data() {
    return {
      baseUrl: '',
      picUrl: '',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
    }
  },
  computed: {},
  methods: {
    handleSuccess(res, file) {
      this.$emit('update:savePath', file.response.data.path)
      this.$emit('update:src', this.picUrl + file.response.data.path)
    }
  }
}
</script>

<style scoped>

</style>
