<template>
  <div class="config-btn-container">
    <el-dialog title="配置按钮" :visible="showConfigBtn" :close-on-click-modal="false" width="1400px" top="4vh" @close="hidePopups()">
      <el-form ref="form" :model="form" size="mini" label-width="120px" v-loading="boxLoading" element-loading-text="拼命加载中">
        <el-row>
          <el-col class="config-table-list" :span="24" v-for="(item, i) in form.buttons" :key="i" v-cloak>
            <el-col :span="24">
              <el-col :span="18" v-if="verSearch(item.unique)">
                <el-form-item label="按钮配置:">
                  <el-select v-model="item.btnConfigs" multiple placeholder="请选择按钮配置">
                    <el-option
                      v-for="items in btnConfigs"
                      :key="items.key"
                      :disabled="(item.name === '添加' || item.name === '编辑') && items.value === 'isBatch' ? true : false"
                      :label="items.key"
                      :value="items.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="config-list-close" :span="verSearch(item.unique) ? 6 : 24">
                <img :src="require('@/static/moveUp.png')" alt="" @click="handerMoveUp(item, i)" />
                <img :src="require('@/static/moveDown.png')" alt="" @click="handeMoveDown(item, i)" />
              </el-col>
            </el-col>
            <el-col :span="6">
              <el-form-item label="按钮名称:">
                <el-input v-model="item.name" placeholder="请输入按钮名称" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!(item.fields.length > 0 && item.fields[0].fieldsType === 'associatedChildTable') && item.unique !== '1001'">
              <el-form-item label="请求地址:" :rules="[{ required: true, message: '请输入请求地址', trigger: 'blur' }]" :prop="'buttons.' + i + '.requestUrl'">
                <el-input v-model="item.requestUrl" placeholder="请输入请求地址" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="item.name !== '查询' && item.name !== '添加' && item.name !== '编辑' && verSearch(item.unique)">
              <div class="config-list-title">字段配置</div>
              <el-col :span="24" v-for="(itemJ, j) in item.fields" :key="j">
                <el-col :span="5">
                  <el-form-item label="类型:">
                    <el-select v-model="itemJ.fieldsType" placeholder="请选择类型">
                      <el-option v-for="(itemS, s) in fieldTypeList" :key="s" :label="itemS.key" :value="itemS.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="提交字段名:" :rules="[{ required: true, message: '请输入提交字段名', trigger: 'blur' }]" :prop="'buttons.' + i + '.fields.' + j + '.submitFieldsName'">
                    <el-input v-model="itemJ.submitFieldsName" placeholder="请输入提交字段名" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="匹配字段名:" :rules="[{ required: true, message: '请输入匹配字段名', trigger: 'blur' }]" :prop="'buttons.' + i + '.fields.' + j + '.matchFiledsName'">
                    <el-input v-model="itemJ.matchFiledsName" placeholder="请输入匹配字段名" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="5" v-if="itemJ.fieldsType === 'associatedChildTable'">
                  <el-form-item label="页面key:" :rules="[{ required: true, message: '请输入页面key', trigger: 'blur' }]" :prop="'buttons.' + i + '.fields.' + j + '.pageMark'">
                    <el-input v-model="itemJ.pageMark" placeholder="请输入页面key" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <img class="list-operate-img" :src="require('@/static/listAdd.png')" alt="" @click="handleAddFiled(item, i, j)" v-if="j === 0" />
                  <img class="list-operate-img" :src="require('@/static/listLess.png')" alt="" @click="handleLessFiled(item, i, j)" v-if="j > 0" />
                </el-col>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm()" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDictionaryByGroup, getConfigTable, getMenuButtons, addOrEditAutomatedConfigTable } from '@/api/configManage';
export default {
  props: {
    showConfigBtn: {
      type: Boolean,
      default: false
    },
    itemObj: {
      type: Object,
      defalut: () => ({})
    }
  },
  computed: {
    verSearch() {
      return unique => {
        if (unique === '1001' || unique === '1002' || unique === '1003') {
          return false;
        } else {
          return true;
        }
      };
    }
  },
  data() {
    return {
      boxLoading: false,
      btnLoading: false,
      fieldTypeList: [],
      btnConfigs: [],
      form: {
        id: 0,
        buttons: undefined,
        functions: undefined,
        dataUrl: undefined,
        fields: undefined
      }
    };
  },
  watch: {
    showConfigBtn(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      try {
        this.boxLoading = true;
        this.fieldTypeList = (await getDictionaryByGroup('FieldType')).data;
        this.btnConfigs = (await getDictionaryByGroup('ButtonConfigGroup')).data;

        const configTableData = (await getConfigTable({ dynamicFilters: [{ field: 'pageId', operate: 'Equal', value: this.itemObj.id }] })).data.datas[0];

        Object.keys(configTableData).forEach(async key => {
          if (key === 'buttons') {
            const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
            let buttons = (await getMenuButtons({ roleId: roleId, key: this.itemObj.key })).data.datas;
            console.log(buttons);
            // .filter(item => item.unique !== '1003');
            if (!configTableData[key]) {
              this.form.buttons = buttons.map(items => {
                {
                  return {
                    pageMark: this.itemObj.key,
                    unique: items.unique,
                    name: items.name,
                    requestUrl: '',
                    btnConfigs: [],
                    fields: [
                      {
                        fieldsType: 'input',
                        submitFieldsName: '',
                        matchFiledsName: '',
                        pageMark: ''
                      }
                    ]
                  };
                }
              });
            } else {
              this.form.buttons = buttons.map(itemK => {
                let obj = {
                  pageMark: this.itemObj.key,
                  unique: itemK.unique,
                  name: itemK.name,
                  requestUrl: '',
                  btnConfigs: [],
                  fields: [
                    {
                      fieldsType: 'input',
                      submitFieldsName: '',
                      matchFiledsName: '',
                      pageMark: ''
                    }
                  ]
                };
                JSON.parse(configTableData[key]).forEach(itemP => {
                  if (itemK.name === itemP.name) {
                    Object.assign(obj, itemP);
                  }
                });
                return obj;
              });
            }
          } else {
            this.form[key] = configTableData[key];
          }
        });

        this.boxLoading = false;
      } catch (error) {
        this.boxLoading = false;
      }
    },
    handleAddFiled(item, index) {
      item.fields.push({ fieldsType: 'input', submitFieldsName: '', matchFiledsName: '' });
    },
    handleLessFiled(item, pIndex, cIndex) {
      item.fields.splice(cIndex, 1);
    },
    handleDeleteFiled(row, index) {
      for (let i = index; i >= 0; i--) {
        let item = this.tableData[i];
        if (item.mergeRowNum) {
          item.mergeRowNum--;
          break;
        }
      }
      this.tableData.splice(index, 1);
    },
    moveFn(index, index1, array) {
      array[index] = array.splice(index1, 1, array[index])[0];
      return array;
    },
    handerMoveUp(item, index) {
      if (index === 0) {
        this.$message.warning('已到最顶部');
        return;
      }
      this.form.buttons = this.moveFn(index, index - 1, this.form.buttons);
    },
    handeMoveDown(item, index) {
      if (index === this.form.buttons.length - 1) {
        this.$message.warning('已到最底部');
        return;
      }
      this.form.buttons = this.moveFn(index, index + 1, this.form.buttons);
    },
    // 添加
    confirm() {
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.buttons = JSON.stringify(formData.buttons);
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addOrEditAutomatedConfigTable(formData)
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
      this.form = {
        id: 0,
        buttons: [],
        functions: undefined,
        dataUrl: undefined,
        isMultipe: undefined,
        isRow: undefined,
        rowWith: 180,
        fields: undefined
      };
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
.config-table-list {
  padding: 20px 0 2px 0;
  border-bottom: 1px solid #b8d7f7;
  .list-operate-img {
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin: 6px 0 0 10px;
  }
  .config-list-title {
    width: 108px;
    margin-bottom: 10px;
    text-align: right;
    color: #409eff;
    font-size: 14px;
  }
  .config-list-close {
    text-align: right;
    img {
      cursor: pointer;
      width: 28px;
      height: 28px;
      margin-left: 10px;
      vertical-align: middle;
    }
  }
}
.config-table-operate {
  padding: 10px 0;
  text-align: right;
  border-bottom: 1px solid #b8d7f7;
}
::v-deep .el-select {
  display: block;
}
</style>
