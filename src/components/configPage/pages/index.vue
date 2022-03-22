<template>
  <div class="config-page-container" v-if="showPage === 1">
    <ConfigTableQuery class="config-page-header" :queryModuleData.sync="queryModuleData" @handleSearch="handleSearch" />
    <ConfigOperateButtons :operateButtons="operateButtons" :selectTableData="selectTableData" :getTableList="getTableList" @handleOperate="handleOperate" />
    <LTable
      class="l-table"
      :tableLoading="tableLoading"
      :tableHeader="tableHeader"
      :tableData="tableData"
      :total="total"
      :tableQueryData.sync="tableQueryData"
      :selectTableData.sync="selectTableData"
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
      :selectTableData="selectTableData"
      :getTableList="getTableList"
      v-on:hidePopups="isOperate = false"
    />
    <ConfigAssociatedChildTable :showAssociatedChildTable="isAssociatedChildTable" :selectObj="selectObjs" :selectTableData="selectTableData" v-on:hidePopups="isAssociatedChildTable = false" />
  </div>
  <el-empty description="暂无配置信息" v-else-if="showPage === 2"></el-empty>
</template>

<script>
import request from '@/utils/request';
import { getPageDetail } from '@/api/configManage';
import ConfigTableQuery from '../components/configTableQuery';
import ConfigOperateButtons from '../components/configOperateButtons';
import ConfigTableForm from '../components/configTableForm';
import ConfigAssociatedChildTable from '../components/configAssociatedChildTable';

import { tableComponentObj } from '@/utils/configPageCustomize';

let tableComponentNames = [];
Object.keys(tableComponentObj).forEach(key => {
  tableComponentNames.push(key);
});

export default {
  components: {
    ConfigTableQuery,
    ConfigOperateButtons,
    ConfigTableForm,
    ConfigAssociatedChildTable,
    ...tableComponentObj
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
      selectTableData: [],
      total: 0,
      tableQueryData: {},

      operateButtons: [],

      operateFields: [],
      isOperate: false,
      isAssociatedChildTable: false,
      selectObjs: {}
    };
  },
  created() {
    this.getData(this.$route.query.key);
  },
  watch: {
    $route(to, form) {
      Object.assign(this.$data, this.$options.data());
      this.getData(to.query.key);
    }
  },
  methods: {
    async getData(key) {
      try {
        const { data } = await getPageDetail(key);
        if (data.pageConfigs) {
          this.showPage = 1;

          this.pageData = data.pageConfigs;

          const fields = JSON.parse(data.pageConfigs.fields);

          if (!!data.pageConfigs.buttons) {
            const operateButtons = JSON.parse(data.pageConfigs.buttons);
            let currentArr = [];
            let newArr = [];
            for (let b = 0; b < operateButtons.length; b++) {
              let item = operateButtons[b];
              if (item.name === '查询' || item.unique == '1001') {
                currentArr = [item, { name: '重置', unique: 'reset', btnConfigs: [] }];
                newArr = operateButtons.slice(b + 1);
                break;
              }
            }
            this.operateButtons = currentArr.length ? [...currentArr, ...newArr] : operateButtons;
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
        this.tableLoading = true;
        let pageQuery = [];

        this.queryModuleData.forEach(item => {
          if (!!item.value) {
            if (item.fieldType === 'date') {
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
        const resTable = await request({ url: this.pageData.dataUrl, method: 'post', data: tableQueryData });
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
      if (item.name === '查询') {
        this.getTableList();
      } else if (item.name === '重置') {
        this.queryModuleData.forEach(item => this.$set(item, 'value', ''));
        this.getTableList();
      } else if (item.name === '添加') {
        this.selectObjs = item;
        this.isOperate = true;
      } else {
        if (!this.selectTableData.length) {
          this.$message.warning('请选择一条数据');
          return;
        }
        if (!item.btnConfigs.includes('isBatch') && this.selectTableData.length > 1) {
          this.$message.warning('最多选择一条数据');
          return;
        }
        if (item.fields.length === 1 && item.fields[0].fieldsType === 'submit') {
          this.$confirm('是否确认执行此操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let delData = {
                [item.fields[0].submitFieldsName]:
                  this.selectTableData.length === 1 ? [this.selectTableData[0][item.fields[0].matchFiledsName]] : this.selectTableData.map(items => items[item.fields[0].matchFiledsName])
              };
              request({ url: item.requestUrl, method: 'post', data: delData }).then(response => {
                this.$notify.success({ title: `${item.name}成功` });
                this.getTableList();
              });
            })
            .catch(err => {});
        } else if (item.fields.length === 1 && item.fields[0].fieldsType === 'associatedChildTable') {
          this.selectObjs = item;
          this.isAssociatedChildTable = true;
        } else {
          this.selectObjs = item;
          this.isOperate = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.config-page-container {
  .l-table {
    margin-top: 5px;
  }
}

.config-page-prompt {
  margin-top: 100px;
  text-align: center;
  font-size: 20px;
  color: #999;
}
</style>
