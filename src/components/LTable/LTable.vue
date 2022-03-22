<template>
  <div class="l-table">
    <el-table v-loading="tableLoading" border :data="tableData" size="mini" @selection-change="mirChange" :max-height="tableHeight" @row-click="rowClick">
      <template v-for="(item, i) in tableHeader">
        <template v-if="item.tableRowCustomize">
          <slot :name="item.prop" :data="item"></slot>
        </template>
        <template v-else>
          <el-table-column :key="i" type="selection" width="40" align="left" v-if="item.prop === 'selection'"></el-table-column>
          <el-table-column :key="i" type="index" :index="indexMethod" :label="'序号'" width="60" align="center" v-else-if="item.prop === 'serialNumber'"></el-table-column>
          <template v-else>
            <el-table-column
              :key="i"
              :prop="item.prop"
              :label="item.label"
              :align="item.align || 'center'"
              :width="item.width || ''"
              :min-width="item.minWidth || ''"
              :fixed="item.fixed || false"
              v-if="item.render"
            >
              <template slot-scope="scope">
                <slot :name="item.prop" :data="scope.row" v-if="item.render"></slot>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="i"
              :prop="item.prop"
              :label="item.label"
              :align="item.align || 'center'"
              :width="item.width || ''"
              :min-width="item.minWidth || ''"
              :fixed="item.fixed || false"
              :sortable="item.sortable || false"
              v-else
            ></el-table-column>
          </template>
        </template>
      </template>
    </el-table>
    <Pagination :total="total" :page.sync="tableQueryData.pageIndex" :limit.sync="tableQueryData.pageMax" @pagination="handlePagination" v-if="!isPagination" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
export default {
  name: 'l-table',
  components: {
    Pagination
  },
  props: {
    tableLoading: {
      type: Boolean,
      defalut: false
    },
    isPagination: {
      type: Boolean,
      defalut: false
    },
    total: {
      type: Number,
      defalut: 0
    },
    tableQueryData: {
      type: Object,
      defalut: () => ({
        pageIndex: 1,
        pageMax: 10
      })
    },
    tableHeader: {
      type: Array,
      defalut: () => []
    },
    tableData: {
      type: Array,
      defalut: () => []
    },
    getTableList: {
      type: Function,
      defalut: null
    },
    selectTableData: {
      type: Array,
      defalut: () => []
    },
    rowStyle: {
      type: Function,
      defalut: null
    },
    rowKey: {
      type: String,
      default: '$index'
    },
    tooltip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableHeight: 480
    };
  },
  created() {
    // this.$nextTick(() => {
    //   let searchFromHeight = 0;
    //   let batchOperatorHeight = 0;
    //   if (this.$slots.searchFrom) {
    //     searchFromHeight = this.$slots.searchFrom[0].componentInstance.$el.clientHeight;
    //   }
    //   if (this.$slots.batchOperator) {
    //     batchOperatorHeight = this.$slots.batchOperator[0].componentInstance.$el.clientHeight;
    //   }
    //   window.innerHeight - 134 - 172 < 500 ? (this.tableHeight =  500) : (this.tableHeight = window.innerHeight);
    // });
  },
  methods: {
    //计算序号
    indexMethod(index) {
      if (!this.isPagination) {
        return index + 1 + (this.tableQueryData.pageIndex - 1) * this.tableQueryData.pageMax;
      } else {
        return index + 1;
      }
    },
    handlePagination() {
      this.$emit('update:tableQueryData', this.tableQueryData);
      this.getTableList();
    },
    mirChange(selection) {
      this.$emit('update:selectTableData', selection);
    },
    rowClick(row, column, event) {
      this.$emit('update:rowClick', row, column, event);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-table thead {
  font-size: 14px;
}
::v-deep .el-table__body-wrapper {
  font-size: 14px;
}
</style>
