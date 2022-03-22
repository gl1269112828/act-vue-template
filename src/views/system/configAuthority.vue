<template>
  <div class="config-authority-container">
    <el-button type="primary" size="mini" @click="handleConfigAuthority(item)">{{ item.name }}</el-button>
    <el-dialog title="配置角色权限" :visible="showPermission" :close-on-click-modal="false" width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small" v-loading="boxLoading" element-loading-text="拼命加载中">
        <el-form-item label="权限:">
          <el-tree ref="tree" style="margin-top:4px" :props="props" :data="treeData" node-key="id" show-checkbox :default-checked-keys="defaultChecked" @check-change="handleCheckChange"></el-tree>
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
import { permissionRoleTree, permissionRole } from '@/api/system';
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    selectTableData: {
      type: Array,
      default: () => []
    },
    getTableList: {
      type: Function,
      defalut: null
    }
  },
  data() {
    return {
      showPermission: false,
      boxLoading: false,
      btnLoading: false,
      props: {
        label: 'lable'
      },
      treeData: [],
      defaultChecked: [],
      form: {
        roleId: null, //角色id
        menuIds: [] //权限
      },
      rules: {}
    };
  },
  methods: {
    handleConfigAuthority() {
      if (!this.selectTableData.length) {
        this.$message.warning('请选择一条数据');
        return;
      }
      if (this.selectTableData.length > 1) {
        this.$message.warning('最多选择一条数据');
        return;
      }
      this.showPermission = true;
      this.getData();
    },
    async getData() {
      this.boxLoading = true;
      try {
        const { data } = await permissionRoleTree({ roleId: this.selectTableData[0].id });
        this.treeData = data.list;
        let childrenIds = [];
        const recursionFn = function(array) {
          array.forEach(item => {
            if (item.children && item.children.length) {
              recursionFn(item.children);
            } else {
              childrenIds.push(item.id);
            }
          });
        };
        recursionFn(data.list);
        this.defaultChecked = data.menuIds.filter(item => {
          if (childrenIds.indexOf(item) > -1) {
            return item;
          }
        });
        this.form.menuIds = data.menuIds;
        this.form.roleId = this.selectTableData[0].id;
        this.boxLoading = false;
      } catch (error) {
        this.boxLoading = false;
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      let ridsa = this.$refs.tree.getCheckedNodes();
      let ridsb = this.$refs.tree.getHalfCheckedNodes();
      let trees = [...ridsb, ...ridsa];
      this.form.menuIds = trees.map(item => item.id);
    },
    // 添加
    confirm() {
      let form = this.form;
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          permissionRole(form)
            .then(response => {
              this.getTableList();
              this.hidePopups();
              this.$notify.success({ title: '配置权限成功' });
              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },
    hidePopups() {
      this.showPermission = false;
      this.$refs.form.resetFields();
      this.treeData = [];
      this.defaultChecked = [];
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>

<style lang="scss" scoped>
.config-authority-container {
  display: inline-block;
  margin-left: 5px;
}
</style>
