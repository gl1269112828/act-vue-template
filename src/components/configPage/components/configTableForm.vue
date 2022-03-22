<template>
  <div class="public-popups">
    <el-dialog :title="selectObj.name" :visible="showOperate" :close-on-click-modal="false" append-to-body width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small" v-loading="boxLoading" element-loading-text="加载中">
        <template v-for="(item, i) in formList">
          <el-form-item :key="i" :label="item.name + ':'" :prop="item.field" v-if="item.showTypes.includes('isAdd') || item.showTypes.includes('idEdit')">
            <el-input
              v-model="form[item.field]"
              type="text"
              :disabled="readonlyFn(item.showTypes)"
              :placeholder="'请输入' + item.name"
              clearable
              v-if="verFieldType(item.showTypes, item.fieldType, 'input') && verAddAndEdit(item.showTypes)"
            />
            <el-input
              v-model="form[item.field]"
              :disabled="readonlyFn(item.showTypes)"
              type="textarea"
              :placeholder="'请输入' + item.name"
              v-else-if="verFieldType(item.showTypes, item.fieldType, 'textarea') && verAddAndEdit(item.showTypes)"
            ></el-input>
            <el-select
              v-model="form[item.field]"
              :disabled="readonlyFn(item.showTypes)"
              :placeholder="'请选择' + item.name"
              clearable
              v-else-if="verFieldType(item.showTypes, item.fieldType, 'select') && verAddAndEdit(item.showTypes)"
            >
              <el-option v-for="(itemS, i) in item.selectArray" :key="i" :label="itemS.key" :value="itemS.value"></el-option>
            </el-select>
            <el-date-picker
              v-model="form[item.field]"
              :disabled="readonlyFn(item.showTypes)"
              value-format="yyyy-MM-dd hh:mm:ss"
              type="datetime"
              placeholder="请选择时间"
              v-else-if="verFieldType(item.showTypes, item.fieldType, 'date') && verAddAndEdit(item.showTypes)"
            ></el-date-picker>
            <el-switch
              v-model="form[item.field]"
              :disabled="readonlyFn(item.showTypes)"
              :active-value="true"
              :inactive-value="false"
              v-else-if="verFieldType(item.showTypes, item.fieldType, 'switch') && verAddAndEdit(item.showTypes)"
            ></el-switch>
            <UploadFile :fileList.sync="form[item.field]" v-else-if="verFieldType(item.showTypes, item.fieldType, 'uploadFile') && verAddAndEdit(item.showTypes)" />

            <!-- <template v-for="itemC in formFieldComponentNames">
              <component
                v-model="form[item.field]"
                :is="itemC"
                :key="i + itemC"
                :selectTableData="selectTableData"
                :item="item"
                v-if="item.showTypes.includes('isFormFieldCustomize') && verAddAndEdit(item.showTypes) && showOperate"
              ></component>
            </template> -->
          </el-form-item>
          <el-form-item :key="i" :label="item.name + ':'" :prop="item.field" v-if="item.showTypes.includes('isFormFieldCustomize') && verAddAndEdit(item.showTypes) && showOperate">
            <template v-for="itemC in formFieldComponentNames">
              <component v-model="form[item.field]" :is="itemC" :key="i + itemC" :selectTableData="selectTableData" :item="item"></component>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm()" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request';
import { formFieldComponentObj } from '@/utils/configPageCustomize';
import UploadFile from '@/components/Upload';

let formFieldComponentNames = [];
Object.keys(formFieldComponentObj).forEach(key => {
  formFieldComponentNames.push(key);
});
export default {
  components: {
    ...formFieldComponentObj,
    UploadFile
  },
  props: {
    showOperate: {
      type: Boolean,
      default: false
    },
    selectObj: {
      type: Object,
      default: () => ({})
    },
    operateFields: {
      type: Array,
      default: () => []
    },
    selectTableData: {
      type: Array,
      default: () => []
    },
    getTableList: {
      type: Function,
      default: null
    }
  },
  computed: {
    readonlyFn() {
      return function(showTypes) {
        if (showTypes.includes('isReadonly')) {
          return true;
        } else {
          return false;
        }
      };
    },
    verFieldType() {
      return function(showTypes, fieldType, value) {
        if (fieldType === value && !showTypes.includes('isFormFieldCustomize')) {
          return true;
        } else {
          return false;
        }
      };
    },
    verAddAndEdit() {
      return function(showTypes) {
        if (this.selectObj.name === '添加') {
          return showTypes.includes('isAdd');
        } else if (this.selectObj.name === '编辑') {
          return showTypes.includes('isEdit');
        }
      };
    }
  },
  data() {
    return {
      boxLoading: false,
      btnLoading: false,
      formFieldComponentNames: formFieldComponentNames,
      formList: [],
      form: {},
      rules: {}
    };
  },
  watch: {
    showOperate(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      this.boxLoading = true;
      let form = this.form;
      const selectTableData = this.selectTableData[0];
      const arrs = JSON.parse(JSON.stringify(this.operateFields));
      for (let i = 0; i < arrs.length; i++) {
        const item = arrs[i];

        if (item.showTypes.includes('isFormRequired')) {
          this.rules[item.field] = [{ required: true, message: item.selectArray && item.selectArray.length ? `请选择${item.name}` : `请输入${item.name}`, trigger: 'blur' }];
        }

        if (!!item.url) {
          item['selectArray'] = (await request({ url: item.url, method: 'GET' })).data.map(item => {
            item.value = JSON.parse(item.value);
            return item;
          });
        }

        if (item.fieldType === 'uploadFile' && selectTableData) {
          if (Array.isArray(selectTableData[item.field])) {
            selectTableData[item.field] = selectTableData[item.field];
          } else {
            selectTableData[item.field] = JSON.parse(selectTableData[item.field]);
          }
        }

        this.$set(form, item.field, undefined);
      }
      this.formList = arrs;
      if (this.selectObj.name === '编辑') {
        Object.assign(this.form, selectTableData);
        if (this.form.password) {
          this.form.password = undefined;
        }
      }
      this.boxLoading = false;
    },
    handleUploadFile() {
      console.log(this.form);
    },

    confirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.form));
          Object.keys(formData).forEach(key => {
            if (Array.isArray(formData[key])) {
              formData[key] = JSON.stringify(formData[key]);
            }
          });
          this.btnLoading = true;
          request({ url: this.selectObj.requestUrl, method: 'post', data: formData })
            .then(response => {
              this.hidePopups();
              this.$notify.success({ title: '成功', message: `${this.selectObj.name}成功` });
              this.getTableList();
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
<style lang="scss" scoped></style>
