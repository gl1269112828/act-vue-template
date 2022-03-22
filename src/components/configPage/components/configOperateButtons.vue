<template>
  <div class="operate-btns-container">
    <template v-for="(item, i) in operateButtons">
      <el-button :type="item.unique !== 'reset' ? 'primary' : ''" size="mini" :key="i" @click="handleOperate(item, i)" v-hasBtn="item.unique" v-cloak v-if="!item.btnConfigs.includes('isBtnCustomize')">
        {{ item.name }}
      </el-button>
      <template v-for="(items, s) in btnComponentNames" v-hasBtn="item.unique" v-else>
        <component :is="items" :item="item" :selectTableData="selectTableData" :getTableList="getTableList" :key="i + s"></component>
      </template>
    </template>
  </div>
</template>

<script>
import { btnComponentObj } from '@/utils/configPageCustomize';

let btnComponentNames = [];
Object.keys(btnComponentObj).forEach(key => {
  btnComponentNames.push(key);
});
export default {
  components: {
    ...btnComponentObj
  },
  props: {
    operateButtons: {
      type: Array,
      default: () => []
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
      btnComponentNames: btnComponentNames
    };
  },
  methods: {
    handleOperate(item) {
      this.$emit('handleOperate', item);
    }
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
::v-deep .el-button + .el-button {
  margin-left: 5px;
}
</style>
