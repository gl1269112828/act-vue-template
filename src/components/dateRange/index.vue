<template>
  <div class="date-range">
    <el-date-picker v-model="startDate" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" placeholder="请选择开始时间" size="mini" @change="mirStartDate"></el-date-picker>
    -
    <el-date-picker v-model="endDate" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" placeholder="请选择结束时间" size="mini" @change="mirEndDate"></el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      startDate: '',
      endDate: ''
    };
  },
  watch: {
    value(val) {
      const time = val.split(',');
      this.startDate = time[0];
      this.endDate = time[1];
    }
  },
  methods: {
    mirStartDate(date) {
      if (!date) {
        this.$emit('update:value', `,${this.endDate}`);
        return false;
      }
      const startTimestamp = this.conversionTimestamp(date);
      const endTimestamp = this.conversionTimestamp(this.endDate);
      if (!!startTimestamp && !!endTimestamp && startTimestamp > endTimestamp) {
        this.startDate = '';
        this.$message.error('开始日期不能大于结束日期');
        return;
      }
      this.$emit('update:value', `${date},${this.endDate}`);
    },
    mirEndDate(date) {
      if (!date) {
        this.$emit('update:value', `${this.startDate},`);
        return false;
      }
      const startTimestamp = this.conversionTimestamp(this.startDate);
      const endTimestamp = this.conversionTimestamp(date);
      if (!!startTimestamp && endTimestamp && endTimestamp < startTimestamp) {
        this.endDate = '';
        this.$message.error('结束日期不能小于开始日期');
        return;
      }
      this.$emit('update:value', `${this.startDate},${date}`);
    },
    conversionTimestamp(str) {
      let newDataStr = str.replace(/\.|\-/g, '/');
      let date = new Date(newDataStr);
      let timestamp = date.getTime();
      return timestamp;
    }
  }
};
</script>

<style lang="scss" scoped></style>
