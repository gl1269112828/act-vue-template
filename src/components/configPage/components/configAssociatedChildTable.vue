<template>
  <div class="config-associated-child-table">
    <el-dialog :title="selectObj.name" :visible="showAssociatedChildTable" :close-on-click-modal="false" width="1200px" top="4vh" @close="hidePopups()">
      <ConfigTableQuery class="config-page-header" :queryModuleData.sync="queryModuleData" @handleSearch="handleSearch" />
      <ConfigOperateButtons :operateButtons="operateButtons" @handleOperate="handleOperate" />
      <LTable
        class="l-table"
        :tableLoading="tableLoading"
        :tableHeader="tableHeader"
        :tableData="tableData"
        :total="total"
        :tableQueryData.sync="tableQueryData"
        :selectTableData.sync="selectTableDatas"
        :getTableList="getTableList"
      >
        <template :slot="item" slot-scope="scope" v-for="(item, h) in tableComponentNames">
          <component :is="item" :key="h + item" :tableHeaderData="scope.data"></component>
        </template>
        <template :slot="item.prop" slot-scope="scope" v-for="item in tableSlotData">
          <template v-for="(itemJ, j) in item.selectArray">
            <span :key="j" v-if="itemJ.value.indexOf(scope.data[item.prop]) > -1">
              {{ itemJ.key }}
            </span>
          </template>
        </template>
      </LTable>
      <ConfigTableForm
        :showOperate="isOperate"
        :selectObj="selectObjs"
        :operateFields="operateFields"
        :selectTableData="selectTableDatas"
        :getTableList="getTableList"
        v-on:hidePopups="isOperate = false"
      />
      <ConfigAssociatedChildTable :showAssociatedChildTable="isAssociatedChildTable" :selectObj="selectObjs" v-on:hidePopups="isAssociatedChildTable = false" />
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request';
import { getPageDetail } from '@/api/configManage';
import ConfigTableQuery from '../components/configTableQuery';
import ConfigOperateButtons from '../components/configOperateButtons';
import ConfigTableForm from '../components/configTableForm';

import { tableComponentObj } from '@/utils/configPageCustomize';

let tableComponentNames = [];
Object.keys(tableComponentObj).forEach(key => {
  tableComponentNames.push(key);
});

export default {
  name: 'ConfigAssociatedChildTable',
  components: {
    ConfigTableQuery,
    ConfigOperateButtons,
    ConfigTableForm,
    ...tableComponentObj
  },
  props: {
    showAssociatedChildTable: {
      type: Boolean,
      default: false
    },
    selectObj: {
      type: Object,
      default: () => ({})
    },
    selectTableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableLoading: false,
      tableComponentNames: tableComponentNames,
      showPage: 0,
      pageData: {},

      queryModuleData: [],

      tableHeader: [],
      tableSlotData: [],
      tableData: [],
      selectTableDatas: [],
      total: 0,
      tableQueryData: {},

      operateButtons: [],
      operateFields: [],
      isOperate: false,
      isAssociatedChildTable: false,
      selectObjs: {}
    };
  },
  watch: {
    showAssociatedChildTable(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData(key) {
      try {
        const selectObj = this.selectObj;

        const { data } = await getPageDetail(selectObj.fields[0].pageMark);

        this.showPage = 1;

        if (data.pageConfigs) {
          this.pageData = data.pageConfigs;

          const fields = JSON.parse(data.pageConfigs.fields);

          if (!!data.pageConfigs.buttons) {
            this.operateButtons = JSON.parse(data.pageConfigs.buttons);
          }

          let headers = [];
          let queries = [];
          let slots = [];
          let index = 0;

          for (let i = 0; i < fields.length; i++) {
            const item = fields[i];
            if (item.showTypes.includes('isTable')) {
              if (i > 0) {
                index++;
              }
              headers.push({ label: item.name, prop: item.field, width: item.width });
            }

            if (!!item.url) {
              item['selectArray'] = (await request({ url: item.url, method: 'GET' })).data;
              slots.push({ selectArray: item.selectArray, prop: item.field });
              headers[index]['render'] = true;
            } else {
              if (headers[index].render) {
                delete headers[index].render;
              }
            }

            if (item.showTypes.includes('isTableCustomize')) {
              if (i > 0) {
                index++;
              }
              headers.push({ label: item.name, prop: item.field, width: item.width });
              headers[index]['tableRowCustomize'] = true;
            }

            if (item.showTypes.includes('isQuery')) {
              !!item.url
                ? queries.push({
                    name: item.name,
                    fieldType: item.fieldType,
                    field: item.field,
                    operate: item.condition,
                    selectArray: item.selectArray,
                    value: ''
                  })
                : queries.push({ name: item.name, fieldType: item.fieldType, field: item.field, operate: item.condition, value: '' });
            }
          }
          headers.unshift({ prop: 'serialNumber' });
          headers.unshift({ prop: 'selection' });

          // console.log(JSON.parse(JSON.stringify(queries)));
          // console.log(JSON.parse(JSON.stringify(fields)));
          // console.log(JSON.parse(JSON.stringify(slots)));
          // console.log(JSON.parse(JSON.stringify(headers)));

          this.queryModuleData = queries;
          this.operateFields = fields;
          this.tableSlotData = slots;
          this.tableHeader = headers;

          await this.getTableList();
        } else {
          this.showPage = 2;
        }
      } catch (error) {}
    },
    async getTableList() {
      try {
        const selectObj = this.selectObj;
        const selectTableData = this.selectTableData;
        this.tableLoading = true;
        let pageQuery = [{ field: selectObj.fields[0].submitFieldsName, operate: 'Equal', value: selectTableData[0][selectObj.fields[0].matchFiledsName] }];
        // console.log(JSON.parse(JSON.stringify(this.queryModuleData)));
        this.queryModuleData.forEach(item => {
          if (!!item.value) {
            if (item.queryType === 'date') {
              const dates = item.value.split(',');
              dates.forEach((itemJ, index) => {
                if (index === 0 && !!itemJ) {
                  pageQuery.push({ field: item.field, operate: 'GreaterThanOrEqual', value: itemJ });
                } else if (index === 1 && !!itemJ) {
                  pageQuery.push({ field: item.field, operate: 'LessThanOrEqual', value: itemJ });
                }
              });
            } else {
              pageQuery.push(item);
            }
          }
        });
        const tableQueryData = {
          pageIndex: this.tableQueryData.pageIndex || 1,
          pageMax: this.tableQueryData.pageMax || 10,
          dynamicFilters: pageQuery
        };
        this.tableQueryData = tableQueryData;
        const resTable = await request({ url: this.pageData.dataUrl, method: 'POST', data: tableQueryData });
        this.total = resTable.data.totalCount;
        this.tableData = resTable.data.datas;
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
      }
    },
    handleSearch() {
      this.getTableList();
    },
    handleOperate(item) {
      if (item.name === '添加') {
        this.isOperate = true;
      } else {
        if (!this.selectTableDatas.length) {
          this.$message.warning('请选择一条数据');
          return;
        }
        if (!item.btnConfigs.includes('isBatch') && this.selectTableDatas.length > 1) {
          this.$message.warning('最多选择一条数据');
          return;
        }
        if (item.operateType === 'associatedChildTable') {
          this.selectObjs = item;
          this.isAssociatedChildTable = true;
        } else {
          if (item.fields.length === 1 && item.fields[0].fieldsType === 'submit') {
            this.$confirm('是否确认执行此操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                let delData = {
                  [item.fields[0].submitFieldsName]: this.selectTableDatas.map(items => items[item.fields[0].matchFiledsName])
                };
                request({ url: item.requestUrl, method: 'post', data: delData }).then(response => {
                  this.$notify.success({ title: `${item.name}成功` });
                  this.getTableList();
                });
              })
              .catch(err => {});
          } else {
            this.selectObjs = item;
            this.isOperate = true;
          }
        }
      }
    },
    confirm() {},
    hidePopups() {
      this.$emit('hidePopups');
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped>
.config-associated-child-table {
  .l-table {
    margin-top: 5px;
  }
}
</style>
