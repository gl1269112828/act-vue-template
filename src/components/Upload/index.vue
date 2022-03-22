<template>
  <div class="upload-container">
    <el-button slot="trigger" icon="el-icon-upload" size="mini" type="primary" @click="handleUploadFile">选取文件</el-button>
    <u-list :list="fileList" v-if="fileList.length" />
    <u-dialog :showUDialog="showUDialog" :title="title" :prompt="prompt" :multiple="multiple" :uploadMultiple="uploadMultiple" v-on:hidePopups="showUDialog = false" />
  </div>
</template>
<script>
import uDialog from './uDialog';
import uList from './uList.vue';
export default {
  name: 'upload',
  components: {
    uDialog,
    uList
  },
  props: {
    uploadFileType: {
      type: String,
      default: ''
    },
    uploadType: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    },
    uploadMultiple: {
      type: Number,
      default: 999999
    },
    prompt: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showUDialog: false
    };
  },
  methods: {
    //上传文件弹窗
    handleUploadFile() {
      if (this.fileList.length >= this.uploadMultiple) {
        this.$notify({ title: '提示', message: '仅支持单文件上传', type: 'warning' });
        return false;
      }
      this.showUDialog = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-container {
  display: inline-block;
}
</style>
