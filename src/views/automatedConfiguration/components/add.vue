<template>
  <div class="add">
    <el-dialog title="创建页面" :visible="showPageAdd" :close-on-click-modal="false" width="600px" top="20vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px" size="small">
        <el-form-item label="页面名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入页面名称" clearable />
        </el-form-item>
        <el-form-item label="页面标识:" prop="key">
          <el-input v-model="form.key" placeholder="请输入页面标识" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm()" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addOrEditAutomatedConfiguration } from '@/api/configManage';
export default {
  props: {
    showPageAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      form: {
        name: undefined,
        key: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
        key: [{ required: true, message: '请输入页面标识', trigger: 'blur' }]
      }
    };
  },
  watch: {
    showPageAdd(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {},
    // 添加
    confirm() {
      let form = this.form;
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addOrEditAutomatedConfiguration(form)
            .then(response => {
              this.hidePopups();
              this.$notify.success({ title: '添加成功' });
              this.$parent.getTableList();
              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },
    hidePopups() {
      this.$emit('hidePopups');
      this.$refs.form.resetFields();
      this.$store.dispatch('common/initObj', this.form);
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-select {
  display: block;
}
</style>
