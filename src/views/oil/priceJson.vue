<template>
  <el-table-column :prop="tableHeaderData.prop" :label="tableHeaderData.label" :width="tableHeaderData.width" align="center">
    <el-table-column label="92#" align="center" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.priceJson ? JSON.parse(scope.row.priceJson)[0].price : '' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="95#" align="center" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.priceJson ? JSON.parse(scope.row.priceJson)[1].price : '' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="98#" align="center" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.priceJson ? JSON.parse(scope.row.priceJson)[2].price : '' }}</span>
      </template>
    </el-table-column>
  </el-table-column>
</template>

<script>
export default {
  props: {
    tableHeaderData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  }
};
</script>

<style></style>
